"use client";

import OrderForm from "@/components/dashboard/order/order-form";
import { Separator } from "@/components/ui/separator";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Order } from "@/types/Api";
import { useEffect, useState } from "react";

const Page = () => {
  const [filter] = useState({ page: 0, search: "", pageSize: 10000 });
  const { data: inventoryData, refetch: refetchInventory } = useAppQuery(ApiQuery.inventories.getInventories(filter));
  const { data: partners, refetch: refetchPartners } = useAppQuery(ApiQuery.partners.getAllPartners());

  useEffect(() => {
    refetchInventory();
    refetchPartners();
  }, []); // Chạy 1 lần khi component mount

  const inventory = inventoryData?.data;

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold mt-2">Đơn hàng</h1>
      <p className="text-sm text-muted-foreground">Thêm thông tin đơn hàng</p>
      <div className="w-2/3">
        <Separator className="my-4" />
        <OrderForm order={{} as Order} inventory={inventory} partners={partners} />
      </div>
    </div>
  );
};

export default Page;
