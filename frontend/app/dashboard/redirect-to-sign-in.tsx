"use client";

import { LoadingFullScreen } from "@/components/loading/loading-full-screen";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const RedirectToSignIn = () => {
  const [atom, setAtom] = useAtom(userAtom);
  useEffect(() => {
    setAtom((prev) => ({ ...prev, showToastErrorSignIn: true }));
  }, [setAtom]);

  if (atom.showToastErrorSignIn) {
    return redirect("/auth/sign-in");
  }

  return <LoadingFullScreen />;
};

export default RedirectToSignIn;
