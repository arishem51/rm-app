import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Receipts from "@/components/dashboard/receipts";
import { ApiQuery } from "@/services/query";

const Page = () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.receipts.getReceipts({ page: 0, search: "" })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Thông tin phiếu nhập</h1>
        <p className="text-sm text-neutral-400 my-1">
          Hiển thị danh sách tất cả các phiếu nhập, cho phép bạn xem chi tiết về
          từng phiếu nhập, bao gồm thông tin cửa hàng, sản phẩm, số lượng và
          trạng thái.
        </p>
        <Receipts />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
