"use client";

import { useMe } from "@/hooks/mutations/user";
import ProtectedUserOwnerView from "./protected-owner-view";

const OwnerUsersView = () => {
  const { data: user } = useMe();

  if (!user?.shopId) {
    return null;
  }

  return <ProtectedUserOwnerView />;
};

export default OwnerUsersView;
