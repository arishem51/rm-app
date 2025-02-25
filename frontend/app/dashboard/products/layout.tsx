import { UserRole } from "@/lib/constants";
import { getMe } from "@/server/actions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export default async function Layout({ children }: Props) {
  const query = await getMe();
  const user = query?.data?.data;
  if (!user?.shopId && user?.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return children;
}
