import { Provider } from "jotai";
import { Fragment, ReactNode } from "react";
import { ThemeProvider } from "./client-provider/theme-provider";
import QueryProvider from "./client-provider/query-provider";
import { Toaster } from "../ui/toaster";

type ProviderProps = {
  children?: ReactNode;
};

const Providers = async ({ children }: ProviderProps) => {
  return (
    <Fragment>
      <Toaster />
      <Provider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
};

export default Providers;
