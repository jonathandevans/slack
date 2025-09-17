import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/lib/api/workspaces/use-new-join-code";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (_: boolean) => void;
  name: string;
  joinCode: string;
}

export function InviteModal({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) {
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one."
  );

  const { mutate, isPending } = useNewJoinCode();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      {
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("New Invite Code generated");
        },
        onError: () => {
          toast.error("Failed to generate new Invite Code");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite People to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-0.5 items-center justify-center py-4">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="link" size="sm" onClick={handleCopy}>
              <CopyIcon className="size-4" />
              Copy Link
            </Button>
          </div>
          <DialogFooter className="flex items-center justify-between! w-full">
            <Button
              onClick={handleNewCode}
              disabled={isPending}
              variant="outline"
            >
              <RefreshCcw className="size-4" />
              New Code
            </Button>
            <DialogClose asChild>
              <Button onClick={() => {}}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
