"use client";

import { useEffect, useMemo } from "react";
import { useGetWorkspaces } from "@/lib/api/workspaces/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/lib/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";

export default function HomeRoute() {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return <></>;
}
