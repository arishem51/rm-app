import { LoadingFullScreen } from "@/components/loading/loading-full-screen";
import { getMe } from "@/server/actions";
import { ReactNode, Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import ClientCompDashboard from "./client-comp-dashboard";

type Props = { children: ReactNode };

const Main = async ({ children }: Props) => {
  const query = await getMe();
  return <ClientCompDashboard meQuery={query}>{children}</ClientCompDashboard>;
};

export default async function Layout({ children }: Props) {
  return (
    <Suspense fallback={<LoadingFullScreen />}>
      <SidebarProvider>
        <AppSidebar />
        <Main>
          <SidebarTrigger />
          {children}
        </Main>
      </SidebarProvider>
    </Suspense>
  );
}
