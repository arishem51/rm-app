import { ReceiptItemResponseDTO } from "@/types/Api";
import { ReactNode } from "react";

const ReceiptItems = ({
  items,
  renderItemLabel,
  maxRenderItems = 2,
}: {
  items?: ReceiptItemResponseDTO[];
  renderItemLabel: (item: ReceiptItemResponseDTO) => ReactNode;
  maxRenderItems?: number;
}) => {
  return (
    <div className="flex flex-col">
      {items?.slice(0, maxRenderItems).map((item) => (
        <div key={item.id} className="flex items-center">
          <div className="text-sm w-52 overflow-hidden text-ellipsis whitespace-nowrap">
            {renderItemLabel(item)}
          </div>
        </div>
      ))}
      {(items?.length ?? 0) > maxRenderItems && <div>...</div>}
    </div>
  );
};

export default ReceiptItems;
