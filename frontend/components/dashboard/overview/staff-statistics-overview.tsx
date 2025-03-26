"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useAppQuery from "@/hooks/use-app-query";
import { toCurrency } from "@/lib/utils";
import { ApiQuery } from "@/services/query";
import { DollarSign } from "lucide-react";

const StaffStatisticsOverview = () => {
  const { data = {}, isLoading } = useAppQuery(
    ApiQuery.statistics.getOverview()
  );
  const { data: overviewStatistics } = data;

  return (
    <>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <DollarSign size={16} />
            <span>Doanh thu trong ngày</span>
          </CardTitle>
          <CardDescription className="text-2xl">
            {isLoading ? (
              <Skeleton className="h-6 w-[100px] mt-1" />
            ) : (
              toCurrency(overviewStatistics?.totalRevenue ?? 0)
            )}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <DollarSign size={16} />
            <span>Sản phẩm bán nhiều nhất</span>
          </CardTitle>
          <CardDescription className="text-2xl">
            {isLoading ? <Skeleton className="h-6 w-[100px] mt-1" /> : 0}
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
};

export default StaffStatisticsOverview;
