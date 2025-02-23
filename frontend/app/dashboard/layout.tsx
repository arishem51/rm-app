import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { getMe } from "@/server/actions";
import { redirect } from "next/navigation";
import ProtectedRole from "@/components/dashboard/protected-role";

type Props = Readonly<{ children: ReactNode }>;

export default async function Layout({ children }: Props) {
  const query = await getMe();
  if (!query?.data?.data) {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <ProtectedRole user={query.data.data}>
          <Header />
          {children}
        </ProtectedRole>
      </main>
    </SidebarProvider>
  );
}
