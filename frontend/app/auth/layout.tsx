"use client";
import { useUserAtomValue } from "@/store/user";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const user = useUserAtomValue();
  if (user) {
    redirect("/dashboard");
  }
  return children;
};

export default Layout;
