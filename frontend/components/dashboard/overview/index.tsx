"use client";

import { Button } from "@/components/ui/button";
import { useUserAtomValue } from "@/store/user";
import AdminOverview from "./admin-overview";

const Overview = () => {
  const { user } = useUserAtomValue();
  if (user?.role !== "ADMIN" && !user?.shop) {
    return (
      <div className="flex items-center flex-col gap-2 mt-4">
        <h1>
          You haven&apos;t register any shop yet, create a shop or join by an
          invite!
        </h1>
        <Button>Create a shop!</Button>
      </div>
    );
  }

  if (user?.role === "ADMIN") {
    return <AdminOverview />;
  }

  return <div>Data overview</div>;
};

export default Overview;
