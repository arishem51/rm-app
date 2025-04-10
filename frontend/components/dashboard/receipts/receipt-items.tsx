import { cn } from "@/lib/utils";
import { ReceiptItemResponseDTO } from "@/types/Api";
import { ReactNode } from "react";

const ReceiptItems = ({
  items,
  renderItemLabel,
  maxRenderItems = 2,
  className,
}: {
  items?: ReceiptItemResponseDTO[];
  renderItemLabel: (item: ReceiptItemResponseDTO) => ReactNode;
  maxRenderItems?: number;
  className?: string;
}) => {
  return (
    <div className="flex flex-col">
      {items?.slice(0, maxRenderItems).map((item) => (
        <div key={item.id} className="flex items-center">
          <div
            className={cn(
              "text-sm overflow-hidden text-ellipsis whitespace-nowrap",
              className
            )}
          >
            {renderItemLabel(item)}
          </div>
        </div>
      ))}
      {(items?.length ?? 0) > maxRenderItems && <div>...</div>}
    </div>
  );
};

export default ReceiptItems;
