/*
 * Dev-only admin endpoints for the content edit proof of concept.
 *
 * A Manager's suggested edit is stored as a Pending request in src/data/contentChangeRequests.json.
 * When an admin confirms it, the new values are written to src/data/approvedContentEdits.json,
 * which localApiClient applies on top of static-api-data.json. static-api-data.json itself is never
 * written: it is generated from the SQL seed scripts and would lose hand edits.
 *
 * Three kinds of item can be edited, each versioned separately:
 * - agent:     an AI tool, applied everywhere the tool appears        -> approved.agents
 * - placement: one week of one role's path (title, outcome, ...)      -> approved.placements
 * - topic:     content shared by every week that uses the Huddle      -> approved.topics
 *
 * `apply: "serve"` keeps this out of production builds. A deployed static site has no server to
 * write files, so the admin page reports that review only works when running locally.
 */
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

const ROUTE = "/__admin/content-edits";
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_FIELD_LENGTH = 4000;

type EntityType = "agent" | "placement" | "topic";

/** Must match EDITABLE_FIELDS_BY_TYPE in src/features/admin/types/contentEdits.types.ts. */
const EDITABLE_FIELDS: Record<EntityType, ReadonlySet<string>> = {
  agent: new Set(["shortDescription", "whatItIs", "whatItHelpsYouDo", "whenToUseIt", "accessLinkLabel", "accessUrl"]),
  placement: new Set(["roleTopicName", "roleTopicDescription", "desiredOutcome", "todayObjective"]),
  topic: new Set(["keyTakeaway", "reflectionPrompt", "commitmentPrompt"]),
};

const SECTION: Record<EntityType, "agents" | "placements" | "topics"> = {
  agent: "agents",
  placement: "placements",
  topic: "topics",
};

type FieldValues = Record<string, string | null>;

interface ChangeRequest {
  id: string;
  entityType: EntityType;
  entityExternalId: string;
  entityName: string;
  topicExternalId: string | null;
  topicName: string | null;
  contextLabel: string | null;
  baseVersion: number;
  before: FieldValues;
  proposed: FieldValues;
  status: "Pending" | "Confirmed";
  submittedBy: string;
  submittedAtUtc: string;
  confirmedAtUtc: string | null;
  confirmedVersion: number | null;
}

/** First-version requests (AI tools only) stored the tool as agentExternalId / agentName. */
type StoredRequest = Partial<ChangeRequest> & { agentExternalId?: string; agentName?: string };

interface ApprovedEdit {
  version: number;
  fields: FieldValues;
  confirmedAtUtc: string;
  requestId: string;
}

interface RequestsFile {
  requests: ChangeRequest[];
}

interface ApprovedFile {
  agents: Record<string, ApprovedEdit>;
  placements: Record<string, ApprovedEdit>;
  topics: Record<string, ApprovedEdit>;
}

class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function contentEditsDevPlugin(dataDirectory: string): Plugin {
  const requestsFile = path.join(dataDirectory, "contentChangeRequests.json");
  const approvedFile = path.join(dataDirectory, "approvedContentEdits.json");
  // Requests are handled one at a time so two quick clicks can never interleave their file writes.
  let queue: Promise<unknown> = Promise.resolve();
  const serialized = <T>(work: () => Promise<T>): Promise<T> => {
    const next = queue.then(work, work);
    queue = next.catch(() => undefined);
    return next;
  };

  const readRequests = async (): Promise<RequestsFile> => {
    const file = await readJson<{ requests?: StoredRequest[] }>(requestsFile, { requests: [] });
    return { requests: (file.requests ?? []).map(normalizeRequest) };
  };

  const readApproved = async (): Promise<ApprovedFile> => {
    const file = await readJson<Partial<ApprovedFile>>(approvedFile, {});
    return { agents: file.agents ?? {}, placements: file.placements ?? {}, topics: file.topics ?? {} };
  };

  async function handle(server: ViteDevServer, request: IncomingMessage, response: ServerResponse): Promise<boolean> {
    const url = new URL(request.url ?? "/", "http://localhost");
    const route = url.pathname.replace(/\/+$/, "");

    if (request.method === "GET" && route === "") {
      const [requests, approved] = await Promise.all([readRequests(), readApproved()]);
      sendJson(response, 200, { requests: requests.requests, approved });
      return true;
    }

    if (request.method === "POST" && route === "/requests") {
      const body = await readBody(request);
      const created = await serialized(() => createRequest(body));
      sendJson(response, 201, created);
      return true;
    }

    const confirmMatch = /^\/requests\/([^/]+)\/confirm$/.exec(route);
    if (request.method === "POST" && confirmMatch) {
      const confirmed = await serialized(() => confirmRequest(decodeURIComponent(confirmMatch[1])));
      sendJson(response, 200, confirmed);
      // A full reload re-reads approvedContentEdits.json from scratch, so every screen, cache and
      // export shows the confirmed values. A hot update could leave old values in memory.
      server.ws.send({ type: "full-reload" });
      return true;
    }

    return false;
  }

  async function createRequest(body: unknown): Promise<ChangeRequest> {
    const input = asRecord(body);
    const entityType = input.entityType;
    if (entityType !== "agent" && entityType !== "placement" && entityType !== "topic") {
      throw new HttpError(400, "entityType must be agent, placement or topic.");
    }
    const entityExternalId = requiredText(input.entityExternalId, "entityExternalId");
    const entityName = requiredText(input.entityName, "entityName");
    const before = fieldValues(input.before, "before", entityType);
    const proposed = fieldValues(input.proposed, "proposed", entityType);
    if (Object.keys(proposed).length === 0) throw new HttpError(400, "No changes were proposed.");

    const [requests, approved] = await Promise.all([readRequests(), readApproved()]);
    const created: ChangeRequest = {
      id: randomUUID(),
      entityType,
      entityExternalId,
      entityName,
      topicExternalId: optionalText(input.topicExternalId),
      topicName: optionalText(input.topicName),
      contextLabel: optionalText(input.contextLabel),
      baseVersion: approved[SECTION[entityType]][entityExternalId]?.version ?? 0,
      before,
      proposed,
      status: "Pending",
      submittedBy: "Manager",
      submittedAtUtc: new Date().toISOString(),
      confirmedAtUtc: null,
      confirmedVersion: null,
    };
    requests.requests.push(created);
    await writeJson(requestsFile, requests);
    return created;
  }

  async function confirmRequest(id: string): Promise<ChangeRequest> {
    const [requests, approved] = await Promise.all([readRequests(), readApproved()]);
    const target = requests.requests.find((item) => item.id === id);
    if (!target) throw new HttpError(404, "This edit no longer exists.");
    if (target.status !== "Pending") throw new HttpError(409, "This edit has already been confirmed.");

    const section = approved[SECTION[target.entityType]];
    const current = section[target.entityExternalId];
    const currentVersion = current?.version ?? 0;
    // The edit was written against an older version of this item; confirming it would silently
    // overwrite the newer confirmed text.
    if (currentVersion !== target.baseVersion) {
      throw new HttpError(409, `${target.entityName} has changed since this edit was suggested (now version ${currentVersion}). Ask the Manager to suggest it again.`);
    }

    const now = new Date().toISOString();
    const version = currentVersion + 1;
    section[target.entityExternalId] = {
      version,
      fields: { ...(current?.fields ?? {}), ...target.proposed },
      confirmedAtUtc: now,
      requestId: target.id,
    };
    target.status = "Confirmed";
    target.confirmedAtUtc = now;
    target.confirmedVersion = version;

    await writeJson(approvedFile, approved);
    await writeJson(requestsFile, requests);
    return target;
  }

  return {
    name: "aito-content-edits-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(ROUTE, (request, response, next) => {
        handle(server, request, response)
          .then((handled) => { if (!handled) next(); })
          .catch((error: unknown) => {
            const status = error instanceof HttpError ? error.status : 500;
            const message = error instanceof Error ? error.message : "Unexpected error.";
            sendJson(response, status, { message });
          });
      });
    },
  };
}

function normalizeRequest(stored: StoredRequest): ChangeRequest {
  return {
    id: stored.id ?? randomUUID(),
    entityType: stored.entityType ?? "agent",
    entityExternalId: stored.entityExternalId ?? stored.agentExternalId ?? "",
    entityName: stored.entityName ?? stored.agentName ?? "",
    topicExternalId: stored.topicExternalId ?? null,
    topicName: stored.topicName ?? null,
    contextLabel: stored.contextLabel ?? null,
    baseVersion: stored.baseVersion ?? 0,
    before: stored.before ?? {},
    proposed: stored.proposed ?? {},
    status: stored.status ?? "Pending",
    submittedBy: stored.submittedBy ?? "Manager",
    submittedAtUtc: stored.submittedAtUtc ?? new Date(0).toISOString(),
    confirmedAtUtc: stored.confirmedAtUtc ?? null,
    confirmedVersion: stored.confirmedVersion ?? null,
  };
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

/** Writes to a temporary file first, so a failed write never leaves a half-written JSON file. */
async function writeJson(file: string, value: unknown): Promise<void> {
  const temporary = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporary, file);
}

function readBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    request.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new HttpError(413, "The request is too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(new HttpError(400, "The request body is not valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new HttpError(400, "The request body must be a JSON object.");
  return value as Record<string, unknown>;
}

function requiredText(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) throw new HttpError(400, `${name} is required.`);
  return value.trim();
}

function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function fieldValues(value: unknown, name: string, entityType: EntityType): FieldValues {
  const record = asRecord(value ?? {});
  const allowed = EDITABLE_FIELDS[entityType];
  const result: FieldValues = {};
  for (const [key, field] of Object.entries(record)) {
    if (!allowed.has(key)) throw new HttpError(400, `${name}.${key} cannot be edited.`);
    if (field !== null && typeof field !== "string") throw new HttpError(400, `${name}.${key} must be text.`);
    if (typeof field === "string" && field.length > MAX_FIELD_LENGTH) throw new HttpError(400, `${name}.${key} is longer than ${MAX_FIELD_LENGTH} characters.`);
    if (key === "accessUrl" && typeof field === "string" && field.trim() && !/^https?:\/\//i.test(field.trim())) {
      throw new HttpError(400, "The link must start with http:// or https://.");
    }
    result[key] = typeof field === "string" ? field.trim() || null : null;
  }
  return result;
}
