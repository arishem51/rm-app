import { LoadingFullScreen } from "@/components/loading/loading-full-screen";
import { getMe } from "@/server/actions";
import { ReactNode, Suspense } from "react";
import RedirectToSignIn from "./redirect-to-sign-in";

type Props = { children: ReactNode };

const Main = async ({ children }: Props) => {
  const me = await getMe();
  if (!me?.data) {
    return <RedirectToSignIn />;
  }
  return <main>{children}</main>;
};

export default async function Layout({ children }: Props) {
  return (
    <Suspense fallback={<LoadingFullScreen />}>
      <Main>{children}</Main>
    </Suspense>
  );
}
