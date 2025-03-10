import Categories from "@/components/dashboard/category";
import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import { ApiQuery } from "@/services/query";

const CategoriesPage = async () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.categories.getCategories({
        page: 0,
        search: "",
        createdAt: "",
      })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Quản lý danh mục</h1>
        <p className="text-sm  text-neutral-400 my-1">
          Thay đổi thông tin của danh mục ở đây
        </p>
        <Categories />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default CategoriesPage;
