import { LoadingFullScreen } from "@/components/loading/loading-full-screen";
import { getMe } from "@/server/actions";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

type Props = { children: ReactNode };

const Main = async ({ children }: Props) => {
  const me = await getMe();
  if (!me) {
    return redirect("/auth/sign-in");
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
