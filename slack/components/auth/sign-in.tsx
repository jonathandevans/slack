"use client";

import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { OAuth } from "./oauth";
import Link from "next/link";

export function SignIn() {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">Sign in to continue</CardTitle>
        <CardDescription>Use your email to access your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
              <TriangleAlert className="size-4" />
              <p>{error}</p>
            </div>
          )}
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>

        <Separator />

        <OAuth pending={pending} setPending={setPending} />

        <Link
          className="w-fit text-xs text-muted-foreground p-0 cursor-pointer hover:underline self-center"
          href="/sign-up"
        >
          Don't have an account yet? Sign up
        </Link>
      </CardContent>
    </Card>
  );
}
