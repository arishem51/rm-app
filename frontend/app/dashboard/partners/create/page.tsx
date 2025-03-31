import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import PartnerCreate from "@/components/dashboard/partner/partner-create";
import { Separator } from "@/components/ui/separator";
import { ApiQuery } from "@/services/query";

const Page = () => {
  return (
    <HydrationPrefetchQuery
      queries={[
        ApiQuery.partners.getAllPartners(),
        ApiQuery.inventories.getAllInventory(),
        ApiQuery.products.getAllProducts(),
      ]}
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Đối tác</h1>
        <p className="text-sm text-muted-foreground">Thêm thông tin đối tác</p>
        <div className="w-2/3 pb-12">
          <Separator className="my-4" />
          <PartnerCreate />
        </div>
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
