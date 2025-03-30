"use client";

import { useAllInventories } from "@/services/hooks/inventories";
import { Combobox } from "./index";
import Image from "next/image";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxInventories({ onSelect, formValue }: Props) {
  const { data: { data: items = [] } = {} } = useAllInventories();

  const options =
    items.length > 0
      ? items.map((item) => ({
          label: item.product?.name ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  const inventoryMap = new Map(items.map((item) => [item.id, item]));

  return (
    <Combobox
      popoverClassname="w-80"
      renderLabel={(option) => {
        const inventory = inventoryMap.get(parseInt(option.value));
        const { product } = inventory ?? {};
        return (
          <div className="flex items-center">
            <div className=" w-8 h-8 flex p-1">
              <Image
                src={product!.imageUrls![0]}
                alt={product!.name!}
                width={32}
                height={32}
                className="rounded-md"
              />
            </div>
            <span className="mx-1">-</span>
            <span className="text-xs whitespace-nowrap">
              {product?.name} - {inventory?.warehouseName} -{" "}
              {inventory?.zoneName}
            </span>
            {product?.supplier?.name ? (
              <>
                <span className="mx-1">-</span>
                <span className="text-xs w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                  {product?.supplier?.name}
                </span>
              </>
            ) : (
              ""
            )}
          </div>
        );
      }}
      onSelect={onSelect}
      formValue={formValue}
      options={options}
    />
  );
}
