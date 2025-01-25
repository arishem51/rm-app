import Users from "@/components/dashboard/user-table/users";
import { getQueryClient } from "@/lib/query-client";
import { ApiQuery } from "@/services/query";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

const Page = async () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(ApiQuery.users.getUsers());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4">
        <Suspense fallback={<div>User loading!</div>}>
          <Users />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default Page;
