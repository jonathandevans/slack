"use client";

import { ChannelHeader } from "@/components/channels/channel-header";
import { ChatInput } from "@/components/channels/chat-input";
import { MessageList } from "@/components/channels/message-list";
import { useGetChannel } from "@/lib/api/channels/use-get-channel";
import { useGetMessages } from "@/lib/api/messages/use-get-messages";
import { useChannelId } from "@/lib/hooks/use-channel-id";
import { Loader2, TriangleAlert } from "lucide-react";

export default function ChannelRoute() {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading || status === "LoadingFirstPage") {
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
      <ChannelHeader channelName={channel.name} />
      <MessageList
        variant="channel"
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
}
