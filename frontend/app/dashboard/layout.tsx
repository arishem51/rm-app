import { LoadingFullScreen } from "@/components/loading/loading-full-screen";
import { getMe } from "@/server/actions";
import { ReactNode, Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar";
import ClientCompDashboard from "@/components/dashboard/client-comp-dashboard";
import Header from "@/components/dashboard/header";

type Props = { children: ReactNode };

const Main = async ({ children }: Props) => {
  const query = await getMe();
  return (
    <main className="w-full">
      <ClientCompDashboard meQuery={query}>{children}</ClientCompDashboard>
    </main>
  );
};

export default async function Layout({ children }: Props) {
  return (
    <Suspense fallback={<LoadingFullScreen />}>
      <SidebarProvider>
        <AppSidebar />
        <Main>
          <Header />
          {children}
        </Main>
      </SidebarProvider>
    </Suspense>
  );
}
