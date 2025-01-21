"use client";
import { BaseResponseUser } from "@/types/Api";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { useHydrateAtoms } from "jotai/utils";
import { userAtom } from "@/store/user";

type Props = {
  children?: ReactNode;
  meQuery?: {
    data: BaseResponseUser;
    status: number;
    token?: string;
  } | null;
};

const ClientCompDashboard = ({ children, meQuery }: Props) => {
  useHydrateAtoms([
    [
      userAtom,
      {
        user: meQuery?.data?.data,
        token: meQuery?.token,
        showToastErrorSignIn: meQuery?.status === 401,
      },
    ],
  ]);
  if (!meQuery) {
    return redirect("/auth/sign-in");
  }
  return children;
};

export default ClientCompDashboard;
