"use client";

import InventoryForm from "@/components/dashboard/inventories/inventory-form";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold mt-2">Hàng hóa</h1>
      <p className="text-sm text-muted-foreground">Thêm thông tin hàng hóa</p>
      <div className="w-2/3">
        <Separator className="my-4" />
        <InventoryForm />
      </div>
    </div>
  );
};

export default Page;
