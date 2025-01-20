"use client";

import { userAtom } from "@/store/user";
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { ReactNode } from "react";

export const AtomProvider = ({ children }: { children: ReactNode }) => {
  useHydrateAtoms([
    [userAtom, { user: undefined, showToastErrorSignIn: true, token: "" }],
  ]);
  return <Provider>{children}</Provider>;
};
