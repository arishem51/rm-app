import { Provider } from "jotai";
import { Fragment, ReactNode } from "react";
import { ThemeProvider } from "./client-provider/theme-provider";
import QueryProvider from "./client-provider/query-provider";
import { Toaster } from "../ui/toaster";
import AtomHydrationProvider from "./client-provider/atom-hydration-provider";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { BaseResponseUserDTO } from "@/types/Api";
import BProgressProvider from "./client-provider/bprogress-provider";

type ProviderProps = {
  children?: ReactNode;
  query?: {
    status: number;
    token?: string;
    data?: BaseResponseUserDTO | null;
  } | null;
};

const Providers = ({ children, query }: ProviderProps) => {
  const queryClient = getQueryClient();
  queryClient.setQueryData(["getMe"], query?.data);
  return (
    <Fragment>
      <Toaster />
      <Provider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <QueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <BProgressProvider>
                <AtomHydrationProvider query={query}>
                  {children}
                </AtomHydrationProvider>
              </BProgressProvider>
            </HydrationBoundary>
          </QueryProvider>
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
};

export default Providers;
