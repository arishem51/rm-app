"use client";

import { globalStore } from "@/store";
import { userAtom } from "@/store/user";
import { BaseResponseUser } from "@/types/Api";
import { useHydrateAtoms } from "jotai/utils";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  query?: {
    data: BaseResponseUser | null;
    status: number;
    token?: string;
  } | null;
};

const HydrateProvider = ({ children, query }: Props) => {
  useHydrateAtoms(
    [
      [
        userAtom,
        {
          user: query?.data?.data,
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
