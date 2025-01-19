"use client";

import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";

const RedirectToSignIn = () => {
  const [atom, setAtom] = useAtom(userAtom);
  setAtom({ ...atom, showToastErrorSignIn: true });
  return redirect("/auth/sign-in");
};

export default RedirectToSignIn;
