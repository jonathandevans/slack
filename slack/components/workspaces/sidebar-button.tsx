import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

export function SidebarButton({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) {
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
