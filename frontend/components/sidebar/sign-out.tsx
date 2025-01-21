"use client";

import { signOut } from "@/server/actions";
import { useSetUserAtom } from "@/store/user";
import { redirect } from "next/navigation";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const DropdownSignOut = () => {
  const setUser = useSetUserAtom();
  const handleSignOut = async () => {
    await signOut();
    setUser({ token: "", user: undefined, showToastErrorSignIn: false });
    return redirect("/auth/sign-in");
  };
  return (
    <DropdownMenuItem onClick={() => handleSignOut()}>
      <span>Sign out</span>
    </DropdownMenuItem>
  );
};

export default DropdownSignOut;
