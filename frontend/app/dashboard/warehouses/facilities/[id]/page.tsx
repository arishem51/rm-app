import FacilityDetails from "@/components/dashboard/facilities/details";
import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
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
        ApiQuery.warehouses.getDetails(id),
        ApiQuery.zones.getAllByWarehouse(id),
      ]}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Kho hàng</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý các khu vực trong kho, các khu vực chứa gạo và chỉnh sửa các
          thông tin của kho hàng.
        </p>
        <FacilityDetails id={id} />
      </div>
    </HydrationPrefetchQuery>
  );
}
