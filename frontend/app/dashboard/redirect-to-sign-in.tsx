"use client";

import { redirect } from "next/navigation";
import { useHydrateAtoms } from "jotai/utils";
import { userAtom } from "@/store/user";

//FIXME: Should fix this component, should hydrate in a provider
const RedirectToSignIn = () => {
  useHydrateAtoms([
    [userAtom, { user: undefined, showToastErrorSignIn: true }],
  ]);
  return redirect("/auth/sign-in");
};

export default RedirectToSignIn;
