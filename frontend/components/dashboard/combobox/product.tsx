"use client";

import { Combobox } from "./index";
import { useAllProducts } from "@/services/hooks/products";

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
    <Combobox onSelect={onSelect} formValue={formValue} options={options} />
  );
}
