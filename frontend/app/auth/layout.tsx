"use client";
import { useUserAtomValue } from "@/store/user";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const userAtom = useUserAtomValue();
  if (userAtom.user) {
    redirect("/dashboard");
  }
  return children;
};

export default Layout;
