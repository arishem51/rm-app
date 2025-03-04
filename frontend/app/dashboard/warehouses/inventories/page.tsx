import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Inventories from "@/components/dashboard/inventories";
import ProtectedShop from "@/components/protected-shop";
import { ApiQuery } from "@/services/query";

const InventoriesPage = () => {
  return (
    <ProtectedShop fallback={{ redirectPath: "/dashboard" }}>
      <HydrationPrefetchQuery
        query={ApiQuery.inventories.getInventories({ page: 0, search: "" })}
        awaitQuery
      >
        <div className="px-4">
          <h1 className="text-3xl font-bold mt-2">Inventory management</h1>
          <p className="text-sm  text-neutral-400 my-1">
            Manage inventories and their information here.
          </p>
          <Inventories />
        </div>
      </HydrationPrefetchQuery>
    </ProtectedShop>
  );
};

export default InventoriesPage;
