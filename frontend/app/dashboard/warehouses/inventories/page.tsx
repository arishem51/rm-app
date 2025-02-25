import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import { ApiQuery } from "@/services/query";

const WarehousesPage = () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.shops.getShops({ page: 0, search: "" })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Inventory management</h1>
        <p className="text-sm  text-neutral-400 my-1">
          Manage inventories and their information here.
        </p>
      </div>
    </HydrationPrefetchQuery>
  );
};

export default WarehousesPage;
