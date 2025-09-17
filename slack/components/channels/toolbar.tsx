import { MessageSquareText, Pencil, Smile, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Hint } from "../ui/hint";
import { EmojiPopover } from "../ui/emoji-popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (_: string) => void;
  hideThreadButton?: boolean;
}

export function Toolbar({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: ToolbarProps) {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>

        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash2 className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
}
