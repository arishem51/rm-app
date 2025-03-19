import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Overview from "@/components/dashboard/overview";
import { ApiQuery } from "@/services/query";

export default function Page() {
  return (
    <div className="px-4">
      <h1 className="text-4xl mt-2 font-bold">Tổng quan</h1>
      <HydrationPrefetchQuery
        queries={[
          ApiQuery.users.getUsers({ page: 0, search: "" }),
          ApiQuery.shops.getShops({ page: 0, search: "" }),
          ApiQuery.statistics.getOverview(),
        ]}
        awaitQuery
      >
        <Overview />
      </HydrationPrefetchQuery>
    </div>
  );
}
