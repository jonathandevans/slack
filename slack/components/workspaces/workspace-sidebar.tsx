"use client";

import { useState } from "react";
import { useCurrentMember } from "@/lib/api/use-current-member";
import { useGetWorkspace } from "@/lib/api/use-get-workspace";
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";
import {
  AlertTriangle,
  ChevronDown,
  HashIcon,
  ListFilter,
  Loader2,
  LucideIcon,
  MessageSquareText,
  SendHorizonal,
  SquarePen,
} from "lucide-react";
import { useGetChannels } from "@/lib/api/use-get-channels";
import { IconType } from "react-icons/lib";
import { cva, VariantProps } from "class-variance-authority";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import { PreferencesModal } from "./modals/preferences-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Hint } from "../ui/hint";

export function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-slack-purple-light h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-slack-purple-light h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slack-purple-light">
      <WorkspaceSidebarHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <WorkspaceSidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
          variant="active"
        />
        <WorkspaceSidebarItem
          label="Drafts & Sent"
          icon={SendHorizonal}
          id="drafts"
        />
        {channels?.map((item) => (
          <WorkspaceSidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
          />
        ))}
      </div>
    </div>
  );
}

function WorkspaceSidebarSection() {}

const workspaceSidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/55 hover:bg-white/55",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function WorkspaceSidebarItem({
  label,
  id,
  icon: Icon,
  variant,
}: {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof workspaceSidebarItemVariants>["variant"];
}) {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      size="sm"
      className={cn(workspaceSidebarItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
}

function WorkspaceSidebarHeader({
  workspace,
  isAdmin,
}: {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  return (
    <>
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />

      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size="sm"
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer uppercase">
              <div className="size-9 relative overflow-hidden bg-slack-purple-light text-white font-semibold text-lg rounded-md flex items-center justify-center">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => {}}
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversations" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
}
