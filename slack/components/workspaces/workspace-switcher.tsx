import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useGetWorkspace } from "@/lib/api/use-get-workspace";
import { useGetWorkspaces } from "@/lib/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/lib/store/use-create-workspace-modal";
import { Loader2, Plus, PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export function WorkspaceSwitcher() {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId);

  const [open, setOpen] = useCreateWorkspaceModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-background hover:bg-background/80 text-slack-purple-dark text-lg">
          {workspaceLoading ? (
            <Loader2 className="animate-spin size-5 shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex flex-col justify-start items-start gap-0"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          <span className="uppercase font-semibold">{workspace?.name}</span>
          <span className="text-xs text-muted-foreground italic">
            Active workspace
          </span>
        </DropdownMenuItem>

        {filteredWorkspaces && filteredWorkspaces.length > 0 && (
          <DropdownMenuSeparator />
        )}
        {filteredWorkspaces?.map((w) => (
          <DropdownMenuItem
            key={w._id}
            className="cursor-pointer uppercase font-semibold"
            onClick={() => router.push(`/workspace/${w._id}`)}
          >
            {w.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex flex-row justify-start items-center gap-1.5"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-5 text-foreground" />
          <span className="font-semibold">New Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
