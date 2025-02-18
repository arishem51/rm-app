"use client";

import { globalStore } from "@/store";
import { authAtom } from "@/store/auth";
import { useHydrateAtoms } from "jotai/utils";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  query?: {
    status: number;
    token?: string;
  } | null;
};

const HydrateProvider = ({ children, query }: Props) => {
  useHydrateAtoms(
    [
      [
        authAtom,
        {
          token: query?.token,
          showToastErrorSignIn: query?.status === 401,
        },
      ],
    ],
    {
      store: globalStore,
    }
  );
  return children;
};

export default HydrateProvider;
