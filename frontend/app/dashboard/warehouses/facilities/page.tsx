import Facilities from "@/components/dashboard/facilities";
import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import { ApiQuery } from "@/services/query";

const WarehousesPage = () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.warehouses.getWarehouses({
        page: 0,
        search: "",
        address: "",
      })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Kho hàng</h1>
        <p className="text-sm  text-neutral-400 my-1">
          Kho hàng và thay đổi thông tin kho ở đây
        </p>
        <Facilities />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default WarehousesPage;
