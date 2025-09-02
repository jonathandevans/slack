"use client";

import { ChannelHeader } from "@/components/channels/channel-header";
import { ChatInput } from "@/components/channels/chat-input";
import { useGetChannel } from "@/lib/api/use-get-channel";
import { useChannelId } from "@/lib/hooks/use-channel-id";
import { Loader2, TriangleAlert } from "lucide-react";

export default function ChannelRoute() {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex items-center gap-y-2 flex-col justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader title={channel.name} />
      <div className="flex-1" />

      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
}
