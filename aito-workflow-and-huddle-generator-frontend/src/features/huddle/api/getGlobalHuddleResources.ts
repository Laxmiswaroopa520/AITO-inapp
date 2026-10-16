import type { ApiClient } from "@/api/apiClient";
import { apiEndpoints } from "@/api/endpoints";
import type { HuddleResourceResponse } from "../types";

/** Resources that are not tied to any topic, activity or AI tool and are available from every Huddle view. */
export function getGlobalHuddleResources(
  apiClient: ApiClient,
  signal?: AbortSignal,
): Promise<HuddleResourceResponse[]> {
  return apiClient.get<HuddleResourceResponse[]>(apiEndpoints.huddles.globalResources, signal);
}
