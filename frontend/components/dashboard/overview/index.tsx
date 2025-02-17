import AdminOverview from "./admin-overview";
import CreateShopView from "../create-shop-view";
import OwnerOverview from "./owner-overview";
import { UserRole } from "@/lib/constants";
import StaffOverview from "./staff-overview";
import { getMe } from "@/server/actions";

const Overview = async () => {
  const query = await getMe();
  const { data } = query ?? {};
  const { data: user } = data ?? {};

  if (user?.role !== UserRole.ADMIN && !user?.shopId) {
    return <CreateShopView />;
  }

  if (user?.role === UserRole.ADMIN) {
    return <AdminOverview />;
  }

  if (user.role === UserRole.OWNER) {
    return <OwnerOverview />;
  }

  return <StaffOverview />;
};

export default Overview;
