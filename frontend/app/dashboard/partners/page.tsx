import CreateShopView from "@/components/dashboard/create-shop-view";
import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import AdminPartnersView from "@/components/dashboard/partner/admin-partners-view";
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

  return (
    <HydrationPrefetchQuery
      queries={[ApiQuery.partners.getPartners({ page: 0 })]}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Quản lý đối tác</h1>
        <p className="text-sm  text-muted-foreground my-1">
          Đối tác, khách hàng là nhà cung cấp hoặc người tiêu dùng của bạn. Bạn
          có thể thêm, sửa đổi hoặc xóa đối tác tại đây.
        </p>
        <AdminPartnersView />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default PartnersPage;
