import CreateShopView from "@/components/dashboard/create-shop-view";
import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import OwnerPartnersView from "@/components/dashboard/partner/owner-partners-view";
import { checkRole } from "@/lib/helpers";
import { getMe } from "@/server/actions";
import { ApiQuery } from "@/services/query";
import { redirect } from "next/navigation";

const PartnersPage = async () => {
  const query = await getMe();
  const user = query?.data?.data;
  const { isOwner, isStaff } = checkRole(user);

  if (isStaff) {
    redirect("/dashboard");
  }

  if (isOwner && !user?.shopId) {
    return <CreateShopView />;
  }

  const getQuery = () => {
    if (isOwner) {
      return ApiQuery.partners.getPartners({ page: 0, search: "" });
    }
    return null;
  };

  return (
    <HydrationPrefetchQuery query={getQuery()} awaitQuery>
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Partners Management</h1>
        <p className="text-sm text-muted-foreground my-1">
          Manage your partners and their information here.
        </p>
        {isOwner && <OwnerPartnersView />}
      </div>
    </HydrationPrefetchQuery>
  );
};

export default PartnersPage;