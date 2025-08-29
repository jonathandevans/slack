"use client";

import { useEffect, useState } from "react";
import { CreateWorkspaceModal } from "../workspaces/modals/create-workspace-modal";

export function ModalProvider() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
}
