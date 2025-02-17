"use client";

import { useUserAtomValue } from "@/store/user";
import AdminOverview from "./admin-overview";
import CreateShopView from "../create-shop-view";
import OwnerOverview from "./owner-overview";

const Overview = () => {
  const { user } = useUserAtomValue();

  if (user?.role !== "ADMIN" && !user?.shopId) {
    return <CreateShopView />;
  }

  if (user?.role === "ADMIN") {
    return <AdminOverview />;
  }

  return <OwnerOverview />;
};

export default Overview;
