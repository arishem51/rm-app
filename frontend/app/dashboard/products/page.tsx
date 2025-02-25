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
        <h1 className="text-3xl font-bold mt-2">Products management</h1>
        <p className="text-sm text-neutral-400 my-1">
          Manage Products and their information here.
        </p>
        <Products />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
