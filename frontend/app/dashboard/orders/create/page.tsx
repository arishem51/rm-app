import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import OrderForm from "@/components/dashboard/order/order-form";
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
        <h1 className="text-3xl font-bold mt-2">Đơn hàng</h1>
        <p className="text-sm text-muted-foreground">Thêm thông tin đơn hàng</p>
        <div className="w-5/6 pb-12">
          <Separator className="my-4" />
          <OrderForm />
        </div>
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
