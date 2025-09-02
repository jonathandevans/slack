import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export function useChannelId() {
  const { channelId } = useParams();
  return channelId as Id<"channels">;
}
