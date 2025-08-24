import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface OAuthProps {
  pending: boolean;
  setPending: (_: boolean) => void;
}

export function OAuth({ pending, setPending }: OAuthProps) {
  const { signIn } = useAuthActions();

  const handleProvider = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <Button
        onClick={() => {
          handleProvider("google");
        }}
        disabled={pending}
        variant="outline"
        size="lg"
        className="w-full relative"
      >
        <FcGoogle className="size-5" />
        Continue with Google
      </Button>
      <Button
        onClick={() => {
          handleProvider("github");
        }}
        disabled={pending}
        variant="outline"
        size="lg"
        className="w-full relative"
      >
        <FaGithub className="size-5" />
        Continue with Github
      </Button>
    </div>
  );
}
