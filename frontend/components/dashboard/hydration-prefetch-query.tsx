"use server";

import { getQueryClient } from "@/lib/query-client";
import {
  FetchQueryOptions,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: FetchQueryOptions<any>;
  awaitQuery?: boolean;
};

const HydrationPrefetchQuery = async ({
  children,
  query,
  awaitQuery,
}: Props) => {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const runQuery = () => queryClient.prefetchQuery(query);
  if (token) {
    if (awaitQuery) {
      await runQuery();
    } else {
      runQuery();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};

export default HydrationPrefetchQuery;
