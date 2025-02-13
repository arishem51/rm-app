"use client";

import { useUserAtomValue } from "@/store/user";
import AdminOverview from "./admin-overview";
import CreateShopView from "../create-shop-view";

const Overview = () => {
  const { user } = useUserAtomValue();

  if (user?.role !== "ADMIN" && !user?.shopId) {
    return <CreateShopView />;
  }

  if (user?.role === "ADMIN") {
    return <AdminOverview />;
  }

  return <div>Data overview</div>;
};

export default Overview;
