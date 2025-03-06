import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import InventoryDetails from "@/components/dashboard/inventories/details";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiQuery } from "@/services/query";

const InventoryPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const id = (await params).id;

  if (isNaN(Number(id))) {
    return (
      <div className="px-4 mt-14">
        <Alert variant="destructive">
          <AlertTitle>Invalid ID</AlertTitle>
          <AlertDescription>The provided ID is not valid.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <HydrationPrefetchQuery
      query={ApiQuery.inventories.getDetails(id)}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Hàng hóa</h1>
        <p className="text-sm text-muted-foreground">
          Edit inventory information here
        </p>
        <InventoryDetails id={id} />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default InventoryPage;
