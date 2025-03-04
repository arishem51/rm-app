"use client";

import { Combobox } from "./index";
import { useAllProducts } from "@/services/hooks/products";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
  shopId: number;
};

export function ComboboxProducts({ onSelect, formValue, shopId }: Props) {
  const { data: { data: products = [] } = {} } = useAllProducts(shopId);

  const options =
    products.length > 0
      ? products.map((item) => ({
          label: item.name ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  return (
    <Combobox onSelect={onSelect} formValue={formValue} options={options} />
  );
}
