import { FormEvent, useState } from "react";
import { useCreateWorkspaceModal } from "@/lib/store/use-create-workspace-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useCreateWorkspace } from "@/lib/api/workspaces/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreateWorkspaceModal() {
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");
  const handleClose = () => {
    setOpen(false);

    setName("");
  };

  const { mutate, isPending } = useCreateWorkspace();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name },
      {
        onSuccess: (id) => {
          toast.success("Workspace created");
          router.push(`/workspace/${id}`);
          handleClose();
        },
        onError: () => {},
        onSettled: () => {},
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal' , 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Continue</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
