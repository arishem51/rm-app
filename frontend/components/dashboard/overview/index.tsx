"use client";

import { useUserAtomValue } from "@/store/user";
import AdminOverview from "./admin-overview";
import CreateShopModal from "../shops/create-shop-modal";

const Overview = () => {
  const { user } = useUserAtomValue();

  if (user?.role !== "ADMIN" && !user?.shopId) {
    return (
      <div className="flex items-center flex-col gap-2 mt-4">
        <h1>
          You haven&apos;t register any shop yet, create a shop or join by an
          invite!
        </h1>
        <CreateShopModal />
      </div>
    );
  }

  if (user?.role === "ADMIN") {
    return <AdminOverview />;
  }

  return <div>Data overview</div>;
};

export default Overview;
