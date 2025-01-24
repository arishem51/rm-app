"use client";

import { signOut } from "@/server/actions";
import { useSetUserAtom } from "@/store/user";
import { redirect } from "next/navigation";
import { DropdownMenuItem } from "../../ui/dropdown-menu";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const DropdownSignOut = ({ children }: Props) => {
  const setUser = useSetUserAtom();
  const handleSignOut = async () => {
    await signOut();
    setUser({ token: "", user: undefined, showToastErrorSignIn: false });
    return redirect("/auth/sign-in");
  };
  return (
    <DropdownMenuItem
      onClick={() => handleSignOut()}
      className="cursor-pointer"
    >
      {children}
    </DropdownMenuItem>
  );
};

export default DropdownSignOut;
