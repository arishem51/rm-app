"use client";

import { signOut } from "@/server/actions";
import { useSetAuthAtom } from "@/store/auth";
import { redirect } from "next/navigation";
import { DropdownMenuItem } from "../../ui/dropdown-menu";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const DropdownSignOut = ({ children }: Props) => {
  const setAuth = useSetAuthAtom();
  const handleSignOut = async () => {
    await signOut();
    setAuth({ token: "", showToastErrorSignIn: false });
    redirect("/auth/sign-in");
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
