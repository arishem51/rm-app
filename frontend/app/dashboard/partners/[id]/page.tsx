import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import PartnerDetails from "@/components/dashboard/partner/details";
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
      queries={[ApiQuery.partners.getPartnerById(id)]}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Đối tác</h1>
        <p className="text-sm text-muted-foreground">
          Thay đổi thông tin đối tác
        </p>
        <PartnerDetails id={id} />
      </div>
    </HydrationPrefetchQuery>
  );
}
