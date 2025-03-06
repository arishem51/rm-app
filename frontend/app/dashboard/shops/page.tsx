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
        <h1 className="text-3xl font-bold mt-2">Quản lý cửa hàng</h1>
        <p className="text-sm  text-neutral-400 my-1">
          Quản lý cửa hàng và thay đổi thông tin cửa hàng tại đây
        </p>
        <Shops />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default ShopPage;
