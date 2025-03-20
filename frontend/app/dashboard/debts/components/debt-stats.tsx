"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiQuery } from "@/services/query";
import { toCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function DebtStats() {
  const debtStatsQuery = ApiQuery.debts.getDebtStatistics();
  const { data: stats, isLoading } = useQuery(debtStatsQuery);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tổng nợ đang chờ
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {toCurrency(stats?.totalOutstanding || 0)}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Nợ quá hạn
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 16v-4a4 4 0 0 0-8 0v4" />
            <path d="M9 10h6" />
            <path d="M13 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
            <rect width="18" height="10" x="3" y="10" rx="2" />
          </svg>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-36" />
          ) : (
            <div className="text-2xl font-bold text-red-500">
              {toCurrency(stats?.overdueAmount || 0)}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Thanh toán sắp tới
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {toCurrency(stats?.upcomingPayments || 0)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 