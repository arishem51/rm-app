"use client";

import TooltipHelp from "@/components/TooltipHelp";

const PackagingTooltip = () => {
  return (
    <TooltipHelp
      trigger={{ text: "Quy cách" }}
      content={{
        text: "Quy cách là cách đóng gói sản phẩm với đơn vị chung là bao, ví dụ như 1 bao 5 kg/10kg/100kg,...",
      }}
    />
  );
};

export default PackagingTooltip;
