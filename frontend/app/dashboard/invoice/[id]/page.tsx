import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import PaymentDetail from "@/components/dashboard/invoice/detail";

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
    <HydrationPrefetchQuery query={ApiQuery.products.getProduct(id)} awaitQuery>
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Hóa đơn thanh toán</h1>
        <PaymentDetail id={id} />
      </div>
    </HydrationPrefetchQuery>
  );
}
