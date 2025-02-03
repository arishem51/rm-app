import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const token = (await cookies()).get("token");
  if (token) {
    redirect("/dashboard");
  }
  return children;
};

export default Layout;
