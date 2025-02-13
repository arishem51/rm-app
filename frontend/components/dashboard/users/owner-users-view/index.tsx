"use client";

import ProtectedUserOwnerView from "./protected-owner-view";
import { useUserAtomValue } from "@/store/user";

const OwnerUsersView = () => {
  const { user } = useUserAtomValue();

  if (!user?.shopId) {
    return null;
  }

  return <ProtectedUserOwnerView />;
};

export default OwnerUsersView;
