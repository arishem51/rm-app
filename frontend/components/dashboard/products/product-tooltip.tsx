"use client";

import TooltipHelp from "@/components/TooltipHelp";

const ProductTooltip = () => {
  return (
    <TooltipHelp
      trigger={{ text: "Sản phẩm" }}
      content={{
        text: "Dữ liệu có thể khác giữa thời điểm nhập và thời điểm hiện tại. Thông tin sản phẩm hiện tại sẽ được hiển thị trong trang chi tiết sản phẩm.",
      }}
    />
  );
};

export default ProductTooltip;
