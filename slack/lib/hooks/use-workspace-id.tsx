import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export function useWorkspaceId() {
  const { workspaceId } = useParams();
  return workspaceId as Id<"workspaces">;
}
