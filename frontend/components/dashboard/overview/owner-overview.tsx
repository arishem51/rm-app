import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Box, CreditCard, DollarSign, UsersRound } from "lucide-react";
import { RevenueChart } from "./revenue-chart";
import { RecentOrders } from "./recent-orders";

const OwnerOverview = () => {
  return (
    <div>
      <div className="mt-4 flex gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <UsersRound size={16} />
              <span>Tổng nhân viên</span>
            </CardTitle>
            <CardDescription className="text-2xl">
              {false ? <Skeleton className="h-6 w-[100px] mt-1" /> : 0}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <Box size={16} />
              <span>Tổng sản phẩm</span>
            </CardTitle>
            <CardDescription className="text-2xl">
              {false ? <Skeleton className="h-6 w-[100px] mt-1" /> : 0}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <DollarSign size={16} />
              <span>Tổng lợi nhuận</span>
            </CardTitle>
            <CardDescription className="text-2xl">
              {false ? <Skeleton className="h-6 w-[100px] mt-1" /> : 0}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <CreditCard size={16} />
              <span>Tổng nợ</span>
            </CardTitle>
            <CardDescription className="text-2xl">
              {false ? <Skeleton className="h-6 w-[100px] mt-1" /> : 0}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Đơn gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerOverview;
