import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { UsersRound } from "lucide-react";

const AdminOverview = () => {
  const { data: shopQuery } = useAppQuery(
    ApiQuery.shops.getShops({ page: 0, search: "" })
  );
  const { data: userQuery } = useAppQuery(
    ApiQuery.users.getUsers({ page: 0, search: "" })
  );

  return (
    <div className="mt-4 flex gap-2">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <UsersRound size={16} />
            <span>Total users</span>
          </CardTitle>
          <CardDescription className="text-neutral-50 text-2xl">
            {userQuery?.data?.totalElements}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <UsersRound size={16} />
            <span>Total shops</span>
          </CardTitle>
          <CardDescription className="text-neutral-50 text-2xl">
            {shopQuery?.data?.totalElements}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminOverview;
