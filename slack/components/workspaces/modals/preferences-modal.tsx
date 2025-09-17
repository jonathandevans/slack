"use client";

import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Trash2 } from "lucide-react";
import { useUpdateWorkspace } from "@/lib/api/workspaces/use-update-workspace";
import { useDeleteWorkspace } from "@/lib/api/workspaces/use-delete-workspace";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/lib/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (_: boolean) => void;
  initialValue: string;
}

export function PreferencesModal({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const [EditConfirmDialog, editConfirm] = useConfirm(
    "Are you sure?",
    "This name change will be visible to everyone on the workspace."
  );
  const [DeleteConfirmDialog, deleteConfirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible and no one will be able to access the workspace anymore."
  );

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ok = await editConfirm();
    if (!ok) return;

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Workspace updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await deleteConfirm();
    if (!ok) return;

    deleteWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("Workspace deleted");
        },
        onError: () => {
          toast.error("Failed to remove workspace");
        },
      }
    );
  };

  return (
    <>
      <EditConfirmDialog />
      <DeleteConfirmDialog />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>Workspace Danger Zone</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <button className="flex flex-col justify-start px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm text-left">{value}</p>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingWorkspace}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              disabled={isDeletingWorkspace}
              onClick={handleDelete}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <Trash2 className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
