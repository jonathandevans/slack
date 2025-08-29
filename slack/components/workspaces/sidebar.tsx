"use client";

import {
  Bell,
  Home,
  Loader2,
  LucideIcon,
  MessagesSquare,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { UserButton } from "../ui/user-button";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { IconType } from "react-icons/lib";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";
import { useGetWorkspaces } from "@/lib/api/use-get-workspaces";
import { useGetWorkspace } from "@/lib/api/use-get-workspace";
import { useCreateWorkspaceModal } from "@/lib/store/use-create-workspace-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[70px] h-full bg-slack-purple-dark flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher />

      <Separator className="w-[70%]! bg-slack-purple-light" />

      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/")}
      />
      <SidebarButton icon={MessagesSquare} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  isActive,
}: {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        variant="transparent"
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20! cursor-pointer",
          isActive && "bg-accent/20"
        )}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all cursor-pointer" />
      </Button>
      <span className="text-xs font-semibold text-white">{label}</span>
    </div>
  );
}

function WorkspaceSwitcher() {
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
