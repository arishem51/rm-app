"use client";

import ProductForm from "@/components/dashboard/products/product-form";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold mt-2">Sản phẩm</h1>
      <p className="text-sm text-muted-foreground">
        Tạo sản phẩm trong cửa hàng của bạn
      </p>
      <div className="w-2/3">
        <Separator className="my-4" />
        <ProductForm />
      </div>
    </div>
  );
};

export default Page;
