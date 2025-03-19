"use client";

import useAppQuery from "@/hooks/use-app-query";
import { toCurrency } from "@/lib/utils";
import { ApiQuery } from "@/services/query";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function RevenueChart() {
  const { data = {} } = useAppQuery(ApiQuery.statistics.getRevenueByMonth());
  const { data: revenueByMonth } = data;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={revenueByMonth?.map((item) => ({
          name: item.month,
          total: item.totalRevenue,
        }))}
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => toCurrency(value)}
          tick={({ x, y, payload }) => (
            <text x={x} y={y} textAnchor="middle" fill="#888888" fontSize={12}>
              <tspan x={x}>{toCurrency(payload.value)}</tspan>
            </text>
          )}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
