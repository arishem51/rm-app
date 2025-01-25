"use client";

import { ApiQuery } from "@/services/query";
import { useSuspenseQuery } from "@tanstack/react-query";

const Users = () => {
  const { data } = useSuspenseQuery(ApiQuery.users.getUsers());

  return (
    <div>
      {data?.data?.data?.map((user) => {
        return <div key={user.id}>{user.name}</div>;
      })}
    </div>
  );
};

export default Users;
