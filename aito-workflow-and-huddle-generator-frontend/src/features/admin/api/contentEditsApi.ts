import type { ContentChangeRequest, ContentEditsState, SubmitContentChangeInput } from "../types/contentEdits.types";

const ROUTE = "/__admin/content-edits";

/** The edit endpoints exist only on the local dev server (see vite/contentEditsDevPlugin.ts). */
export class ContentEditsUnavailableError extends Error {
  constructor() {
    super("Suggesting and confirming content edits works only when the app runs locally with npm run dev.");
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${ROUTE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  // A deployed static site has no such endpoint and answers with index.html (or a 404 page), not JSON.
  if (!(response.headers.get("content-type") ?? "").includes("application/json")) throw new ContentEditsUnavailableError();
  const body = await response.json() as T & { message?: string };
  if (!response.ok) throw new Error(body.message ?? `The request failed (${response.status}).`);
  return body;
}

export const getContentEdits = () => call<ContentEditsState>("");

export const submitContentChange = (input: SubmitContentChangeInput) =>
  call<ContentChangeRequest>("/requests", { method: "POST", body: JSON.stringify(input) });

export const confirmContentChange = (id: string) =>
  call<ContentChangeRequest>(`/requests/${encodeURIComponent(id)}/confirm`, { method: "POST" });
