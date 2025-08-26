"use client";

import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";

export function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId();
  
  return <div>Workspace Sidebar</div>;
}
