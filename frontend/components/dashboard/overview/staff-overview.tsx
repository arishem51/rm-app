import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "./revenue-chart";
import { RecentOrders } from "./recent-orders";
import StaffStatisticsOverview from "./staff-statistics-overview";

const StaffOverview = () => {
  return (
    <div>
      <div className="mt-4 flex gap-4">
        <StaffStatisticsOverview />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
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

export default StaffOverview;
