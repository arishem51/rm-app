import CreateShopView from "@/components/dashboard/create-shop-view";
import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import AdminPartnersView from "@/components/dashboard/partner/admin-partners-view";
// import AdminUsersView from "@/components/dashboard/users/admin-users-view";
// import OwnerUsersView from "@/components/dashboard/users/owner-users-view";
import { checkRole } from "@/lib/helpers";
import { getMe } from "@/server/actions";
import { ApiQuery } from "@/services/query";
import { redirect } from "next/navigation";

const PartnersPage = async () => {
  const query = await getMe();
  const user = query?.data?.data;
  const { isAdmin, isOwner, isStaff } = checkRole(user);

  if (isStaff) {
    redirect("/dashboard");
  }

  if (isOwner && !user?.shopId) {
    return <CreateShopView />;
  }

  const getQuery = () => {
    if (isAdmin) {
      return ApiQuery.users.getUsers({ page: 0, search: "" });
    }
    if (isOwner) {
      console.log("Owner", user);
      
      return ApiQuery.partners.getPartners({ page: 0, search: "" });
    }
    return null;
  };

  return (
    <HydrationPrefetchQuery query={getQuery()} awaitQuery>
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Partners management</h1>
        <p className="text-sm  text-muted-foreground my-1">
          Manage partners and their information here.
        </p>
        <AdminPartnersView />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default PartnersPage;
