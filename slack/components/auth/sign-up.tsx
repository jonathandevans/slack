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
import { OAuth } from "./oauth";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

export function SignUp() {
  const { signIn } = useAuthActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch((error) => {
        setError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">Sign up to continue</CardTitle>
        <CardDescription>
          Use your email to create your new account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
              <TriangleAlert className="size-4" />
              <p>{error}</p>
            </div>
          )}
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Full Name"
            required
          />
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
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="Confirm Password"
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
          href="/sign-in"
        >
          Already have an account? Sign in
        </Link>
      </CardContent>
    </Card>
  );
}
