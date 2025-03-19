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
  query?: FetchQueryOptions<any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queries?: (FetchQueryOptions<any> | null)[] | null;
  awaitQuery?: boolean;
};

const HydrationPrefetchQuery = async ({
  children,
  query,
  queries,
  awaitQuery,
}: Props) => {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const runQuery = () => {
    if (query) {
      return queryClient.prefetchQuery(query);
    }
    if (queries && queries.length > 0) {
      return Promise.all(
        queries?.map((q) => {
          if (q) {
            return queryClient.prefetchQuery(q);
          }
        })
      );
    }
  };
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
