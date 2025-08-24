import { ReactNode } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center bg-slack-purple">
      <div className="md:h-auto md:w-[420px] relative">
        {children}
        <Image
          src={Logo}
          alt="Logo"
          className="absolute -bottom-15 left-[50%] translate-x-[-50%] size-10"
        />
      </div>
    </div>
  );
}
