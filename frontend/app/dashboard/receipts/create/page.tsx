"use client";

import ReceiptForm from "@/components/dashboard/receipts/receipt-form";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold mt-2">Phiếu nhập</h1>
      <p className="text-sm text-muted-foreground">
        Tạo phiếu nhập trong cửa hàng của bạn
      </p>
      <div className="w-2/3">
        <Separator className="my-4" />
        <ReceiptForm />
      </div>
    </div>
  );
};

export default Page;
