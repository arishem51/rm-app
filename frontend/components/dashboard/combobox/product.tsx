"use client";

import { Combobox } from "./index";
import { useAllProducts } from "@/services/hooks/products";
import Image from "next/image";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxProducts({ onSelect, formValue }: Props) {
  const { data: { data: products = [] } = {} } = useAllProducts();

  const options =
    products.length > 0
      ? products.map((item) => ({
          label: item.name ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  return (
    <Combobox
      popoverClassname="w-80"
      renderLabel={(option) => {
        const product = products.find(
          (item) => item.id?.toString() === option.value
        );
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
<<<<<<< HEAD
            <span className="text-xs">{product?.name}</span>
            <span className="mx-1">-</span>
            <span className="text-xs w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {product?.supplier?.name}
            </span>
=======
            <span className="text-xs whitespace-nowrap">{product?.name}</span>
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
>>>>>>> eb9dd80d805fce50655c33f4b66dcc881fbcbcdd
          </div>
        );
      }}
      onSelect={onSelect}
      formValue={formValue}
      options={options}
    />
  );
}
