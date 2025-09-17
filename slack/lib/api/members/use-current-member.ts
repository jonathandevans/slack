import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface iProps {
  workspaceId: Id<"workspaces">;
}

export function useCurrentMember({ workspaceId }: iProps) {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
}
