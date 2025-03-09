import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Payment from "@/components/dashboard/payment";
import { ApiQuery } from "@/services/query";

const Page = async () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.payment.getAllPayment()}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Hóa Đơn</h1>
        <Payment />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;