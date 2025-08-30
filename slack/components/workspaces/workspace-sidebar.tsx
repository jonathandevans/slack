"use client";

import { ReactNode, useState } from "react";
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
  PlusIcon,
  SendHorizonal,
  SquarePen,
} from "lucide-react";
import { useGetChannels } from "@/lib/api/use-get-channels";
import { IconType } from "react-icons/lib";
import { cva, VariantProps } from "class-variance-authority";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { PreferencesModal } from "./modals/preferences-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Hint } from "../ui/hint";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";
import { useGetMembers } from "@/lib/api/use-get-members";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCreateChannelModal } from "@/lib/store/use-create-channel-modal";
import { InviteModal } from "./modals/invite-modal";

export function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
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
      </div>

      <WorkspaceSidebarSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <WorkspaceSidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
          />
        ))}
      </WorkspaceSidebarSection>

      <WorkspaceSidebarSection
        label="Direct Messages"
        hint="New Direct Messages"
      >
        {members?.map((item) => (
          <WorkspaceSidebarUserButton
            key={item._id}
            id={member._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSidebarSection>
    </div>
  );
}

function WorkspaceSidebarSection({
  children,
  label,
  hint,
  onNew,
}: {
  children: ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}) {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2 group">
      <div className="flex items-center px-3.5">
        <Button
          variant="transparent"
          className="p-0.5 text-sm text-[#f9edffcc] shrink size-6"
          onClick={toggle}
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", on && "-rotate-90")}
          />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden items-center"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="iconSm"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
}

const workspaceSidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[10px] text-sm overflow-hidden",
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
        <Icon className="size-3.5 shrink-0" />
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
  const [inviteOpen, setInviteOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />

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
                  onClick={() => setInviteOpen(true)}
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

const workspaceSidebarUserButtonVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[10px] text-sm overflow-hidden",
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

function WorkspaceSidebarUserButton({
  id,
  label = "Member",
  image,
  variant,
}: {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof workspaceSidebarUserButtonVariants>["variant"];
}) {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      className={cn(workspaceSidebarUserButtonVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-full mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
            {label.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
}
