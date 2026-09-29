import { useMemo } from "react";
import { createLocalApiClient } from "./localApiClient";
import type { ApiClient } from "./apiClient";

export function useApiClient(): ApiClient {
  return useMemo(() => createLocalApiClient(), []);
}
