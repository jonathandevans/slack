import { FaChevronDown } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Trash2 } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { useUpdateChannel } from "@/lib/api/channels/use-update-channel";
import { useChannelId } from "@/lib/hooks/use-channel-id";
import { toast } from "sonner";
import { useDeleteChannel } from "@/lib/api/channels/use-delete-channel";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";
import { useCurrentMember } from "@/lib/api/members/use-current-member";

interface ChannelHeaderProps {
  channelName: string;
}

export function ChannelHeader({ channelName }: ChannelHeaderProps) {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [value, setValue] = useState(channelName);
  const [editOpen, setEditOpen] = useState(false);

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: deleteChannel, isPending: isDeletingChannel } =
    useDeleteChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;

    setEditOpen(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(v);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action will permanently delete this channel, meaning no one can access it."
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    await deleteChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete the channel");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />

      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
              size="sm"
            >
              <span># {channelName}</span>
              <FaChevronDown className="size-2.5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {channelName}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <button className="flex flex-col justify-start px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    </div>
                    <p className="text-sm text-left"># {channelName}</p>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                      value={value}
                      disabled={isUpdatingChannel}
                      onChange={handleChange}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="Channel name e.g. 'plan-budget'"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isUpdatingChannel}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatingChannel}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {member?.role === "admin" && (
                <button
                  disabled={isDeletingChannel}
                  onClick={handleDelete}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                >
                  <Trash2 className="size-4" />
                  <p className="text-sm font-semibold">Delete channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
