import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { ShoppingBagIcon, UsersRound } from "lucide-react";

const AdminOverview = () => {
  const { data: shopQuery, isLoading: isShopQueryLoading } = useAppQuery(
    ApiQuery.shops.getShops({ page: 0, search: "" })
  );
  const { data: userQuery, isLoading: isUserQueryLoading } = useAppQuery(
    ApiQuery.users.getUsers({ page: 0, search: "" })
  );

  return (
    <div className="mt-4 flex gap-2">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <UsersRound size={16} />
            <span>Tổng tài khoản</span>
          </CardTitle>
          <CardDescription className="text-2xl">
            {isUserQueryLoading ? (
              <Skeleton className="h-6 w-[100px] mt-1" />
            ) : (
              userQuery?.data?.totalElements
            )}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <ShoppingBagIcon size={16} />
            <span>Tổng cửa hàng</span>
          </CardTitle>
          <CardDescription className="text-2xl">
            {isShopQueryLoading ? (
              <Skeleton className="h-6 w-[100px] mt-1" />
            ) : (
              shopQuery?.data?.totalElements
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminOverview;
