"use client";

import { Fragment } from "react";
import { User2 } from "lucide-react";
import { useUserAtomValue } from "@/store/user";

const UserFooter = () => {
  const { user } = useUserAtomValue();
  return (
    <Fragment>
      <User2 /> {user?.name}
    </Fragment>
  );
};

export default UserFooter;
