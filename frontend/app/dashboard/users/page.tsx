import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import Users from "@/components/dashboard/users";
import { ApiQuery } from "@/services/query";

const Page = async () => {
  return (
    <HydrationPrefetchQuery
      query={ApiQuery.users.getUsers({ page: 0, search: "" })}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">User management</h1>
        <p className="text-sm  text-neutral-400 my-1">
          Manage users member and their information here.
        </p>
        <Users />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
