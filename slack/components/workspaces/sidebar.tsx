"use client";

import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import { UserButton } from "../ui/user-button";
import { SidebarButton } from "./sidebar-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";

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
