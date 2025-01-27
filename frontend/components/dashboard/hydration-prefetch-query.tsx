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
};

const HydrationPrefetchQuery = async ({ children, query }: Props) => {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) {
    queryClient.prefetchQuery(query);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};

export default HydrationPrefetchQuery;
