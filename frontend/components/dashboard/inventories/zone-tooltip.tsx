"use client";

import TooltipHelp from "@/components/TooltipHelp";

const ZoneTooltip = () => {
  return (
    <TooltipHelp
      trigger={{ text: "Khu vực" }}
      content={{
        text: "Là khu vực trong kho mà sản phẩm được lưu trữ, bao gồm tên kho và tên khu vực, ví dụ như Kho A - Khu vực 1 (Giá trị có thể khác giữa các thời điểm hiện tại và thời điểm nhập).",
      }}
    />
  );
};

export default ZoneTooltip;
