"use client";

import { Info, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";
import { useGetWorkspace } from "@/lib/api/workspaces/use-get-workspace";

export function Toolbar() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <nav className="bg-slack-purple-dark flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />

      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-1" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
      </div>

      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-4 text-white" />
        </Button>
      </div>
    </nav>
  );
}
