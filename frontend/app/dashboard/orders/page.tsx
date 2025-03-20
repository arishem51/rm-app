import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Orders from "@/components/dashboard/order";
import { ApiQuery } from "@/services/query";

const OrdersPage = async () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.orders.getOrders({ page: 0 })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Quản lý Đơn hàng</h1>
        <p className="text-sm  text-neutral-400 my-1">
          Thay đổi thông tin của đơn hàng ở đây
        </p>
        <Orders />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default OrdersPage;
