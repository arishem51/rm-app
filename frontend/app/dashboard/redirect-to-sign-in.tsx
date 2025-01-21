"use client";

import { LoadingFullScreen } from "@/components/loading/loading-full-screen";
import { useUserAtom } from "@/store/user";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const RedirectToSignIn = ({
  showToastSignIn,
}: {
  showToastSignIn?: boolean;
}) => {
  const [atom, setAtom] = useUserAtom();
  useEffect(() => {
    if (showToastSignIn) {
      setAtom({ showToastErrorSignIn: true });
    }
  }, [setAtom, showToastSignIn]);

  if (atom.showToastErrorSignIn) {
    return redirect("/auth/sign-in");
  }

  return <LoadingFullScreen />;
};

export default RedirectToSignIn;
