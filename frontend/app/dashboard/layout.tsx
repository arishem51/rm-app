import { LoadingFullScreen } from "@/components/loading/loading-full-screen";
import { getMe } from "@/server/actions";
import { ReactNode, Suspense } from "react";
import RedirectToSignIn from "./redirect-to-sign-in";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

type Props = { children: ReactNode };

const Main = async ({ children }: Props) => {
  const me = await getMe();
  if (!me?.data) {
    return <RedirectToSignIn showToastSignIn={me?.status === 401} />;
  }
  return <main>{children}</main>;
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
