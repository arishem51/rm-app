import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { getMe } from "@/server/actions";
import { redirect } from "next/navigation";

type Props = { children: ReactNode };

export default async function Layout({ children }: Props) {
  //FIXME: make sure getMe is cached
  const query = await getMe();
  if (!query?.data) {
    return redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
