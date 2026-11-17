import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmContentChange, getContentEdits, submitContentChange } from "../api/contentEditsApi";
import type { SubmitContentChangeInput } from "../types/contentEdits.types";

const contentEditsKey = ["admin", "content-edits"] as const;

export function useContentEdits() {
  return useQuery({ queryKey: contentEditsKey, queryFn: getContentEdits, retry: false });
}

export function useSubmitContentChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitContentChangeInput) => submitContentChange(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: contentEditsKey }),
  });
}

export function useConfirmContentChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmContentChange(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: contentEditsKey }),
  });
}
