import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import InventoryDetails from "@/components/dashboard/inventories/details";
import AlertInvalidId from "@/components/view/alert/alert-invalid-id";
import { ApiQuery } from "@/services/query";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;

  if (isNaN(Number(id))) {
    return <AlertInvalidId />;
  }

  return (
    <HydrationPrefetchQuery
      queries={[
        ApiQuery.inventories.getDetails(id),
        ApiQuery.products.getAllProducts(),
      ]}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Hàng hóa</h1>
        <p className="text-sm text-muted-foreground">Xem thông tin hàng hóa</p>
        <InventoryDetails id={id} />
      </div>
    </HydrationPrefetchQuery>
  );
}
