"use client";

import { useUserAtomValue } from "@/store/user";
import AdminOverview from "./admin-overview";
import CreateShopModal from "../shops/create-shop-modal";

const Overview = () => {
  const { user } = useUserAtomValue();

  if (user?.role !== "ADMIN" && !user?.shopId) {
    return <CreateShopModal />;
  }

  if (user?.role === "ADMIN") {
    return <AdminOverview />;
  }

  return <div>Data overview</div>;
};

export default Overview;
