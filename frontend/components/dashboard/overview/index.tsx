"use client";

import AdminOverview from "./admin-overview";
import CreateShopView from "../create-shop-view";
import OwnerOverview from "./owner-overview";
import StaffOverview from "./staff-overview";
import { useMe } from "@/hooks/mutations/user";
import { checkRole } from "@/lib/helpers";

const Overview = () => {
  const { data: user } = useMe();
  const { isAdmin, isOwner } = checkRole(user);

  if (!isAdmin && !user?.shopId) {
    return <CreateShopView />;
  }

  if (isAdmin) {
    return <AdminOverview />;
  }

  if (isOwner) {
    return <OwnerOverview />;
  }

  return <StaffOverview />;
};

export default Overview;
