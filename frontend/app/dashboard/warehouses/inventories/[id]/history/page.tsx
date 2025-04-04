import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import InventoryHistories from "@/components/dashboard/inventories/histories";
import AlertInvalidId from "@/components/view/alert/alert-invalid-id";
import { ApiQuery } from "@/services/query";

const Page = async ({ params }: { params: Promise<{ id: number }> }) => {
  const id = (await params).id;

  if (isNaN(Number(id))) {
    return <AlertInvalidId />;
  }
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.inventories.getHistory(id, { page: 0, search: "" })}
      awaitQuery
    >
      <div className="px-4 pb-8">
        <h1 className="text-3xl font-bold mt-2">
          Danh sách chỉnh sửa hàng hóa
        </h1>
        <p className="text-sm text-neutral-400 my-1">
          Hiển thị lịch sử chỉnh sửa hàng hóa.
        </p>
        <InventoryHistories id={id} />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
