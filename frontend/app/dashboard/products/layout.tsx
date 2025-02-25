import { getMe } from "@/server/actions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export default async function Layout({ children }: Props) {
  const query = await getMe();
  if (!query?.data?.data?.shopId) {
    redirect("/dashboard");
  }

  return children;
}
