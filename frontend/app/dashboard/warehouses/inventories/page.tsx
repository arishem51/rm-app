import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Inventories from "@/components/dashboard/inventories";
import ProtectedShop from "@/components/view/protected/protected-shop";
import { ApiQuery } from "@/services/query";

const InventoriesPage = () => {
  return (
    <ProtectedShop fallback={{ redirectPath: "/dashboard" }}>
      <HydrationPrefetchQuery
        queries={[
          ApiQuery.inventories.getInventories({ page: 0, search: "" }),
          ApiQuery.zones.getAllByShop(),
        ]}
        awaitQuery
      >
        <div className="px-4">
          <h1 className="text-3xl font-bold mt-2">Quản lý hàng hóa</h1>
          <p className="text-sm  text-neutral-400 my-1">
            Quản lý và thay đổi thông tin hàng hóa của bạn
          </p>
          <Inventories />
        </div>
      </HydrationPrefetchQuery>
    </ProtectedShop>
  );
};

export default InventoriesPage;
