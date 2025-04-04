import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Products from "@/components/dashboard/products";
import { ApiQuery } from "@/services/query";

const Page = () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.products.getProducts({ page: 0, search: "" })}
      awaitQuery
    >
      <div className="px-4 pb-8">
        <h1 className="text-3xl font-bold mt-2">Quản lý sản phẩm</h1>
        <p className="text-sm text-neutral-400 my-1">
          Sản phẩm chứa thông tin về sản phẩm của bạn, bao gồm tên, giá niêm
          yết, danh mục và nhà cung cấp. Bạn có thể thêm, sửa đổi hoặc xóa sản
          phẩm tại đây.
        </p>
        <Products />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
