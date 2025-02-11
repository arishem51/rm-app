import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Shops from "@/components/dashboard/shops";
import { ApiQuery } from "@/services/query";

const ShopPage = async () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.shops.getShops({ page: 0, search: "" })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Shop management</h1>
        <p className="text-sm  text-neutral-400 my-1">
          Manage shops and their information here.
        </p>
        <Shops />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default ShopPage;
