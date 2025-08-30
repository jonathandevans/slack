"use client";

import Image from "next/image";
import Logo from "@/public/logo.png";
import VerificationInput from "react-verification-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "@/lib/api/use-get-workspace-info";
import { Loader2 } from "lucide-react";
import { useJoin } from "@/lib/api/use-join";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";

export default function JoinRoute() {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);
  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`)
    }
    
  }, [isMember, router, workspaceId])

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          toast.success("Workspace joined");
          router.replace(`/workspace/${id}`);
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-sm">
      <Image src={Logo} alt="Logo" width={60} height={60} />

      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>

        <VerificationInput
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md! border! border-gray-300! flex items-center justify-center text-xl! font-medium! text-gray-500!",
            characterInactive: "bg-muted!",
            characterSelected: "bg-white! text-black!",
            characterFilled: "bg-white! text-black!",
          }}
          autoFocus
          length={6}
          onComplete={handleComplete}
        />
      </div>

      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
