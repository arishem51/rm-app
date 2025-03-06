import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Products from "@/components/dashboard/products";
import { ApiQuery } from "@/services/query";

const Page = () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.products.getProducts({ page: 0, search: "" })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Quản lý sản phẩm</h1>
        <p className="text-sm text-neutral-400 my-1">
          Quản lý sản phẩm và thay đổi thông tin sản phẩm ở đây
        </p>
        <Products />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
