"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/server/actions";
import { userAtom } from "@/store/user";
import { useSetAtom } from "jotai";
import { redirect } from "next/navigation";

const SignOutPage = () => {
  const setUser = useSetAtom(userAtom);
  const handleSignOut = async () => {
    await signOut();
    setUser({ token: "", user: undefined, showToastErrorSignIn: false });
    return redirect("/auth/sign-in");
  };
  return <Button onClick={handleSignOut}>Sign out</Button>;
};

export default SignOutPage;
