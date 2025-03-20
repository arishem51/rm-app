import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Requests from "@/components/dashboard/request";
import { ApiQuery } from "@/services/query";

const Page = () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.products.getProducts({ page: 0, search: "" })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Quản lý yêu cầu tạo mới sản phẩm</h1>
        <p className="text-sm text-neutral-400 my-1">
          Quản lý yêu cầu và xác thực thông tin sản phẩm ở đây
        </p>
        <Requests />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
