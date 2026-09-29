import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { CurrentUser } from "./auth.types";

const localUser: CurrentUser = {
  objectId: "local-user",
  email: null,
  displayName: "AITO User",
  roles: [],
  isAuthenticated: true,
};

export function useCurrentUser(): UseQueryResult<CurrentUser, Error> {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: async () => localUser,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
