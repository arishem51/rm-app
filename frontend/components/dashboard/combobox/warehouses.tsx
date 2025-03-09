"use client";

import { Combobox } from "./index";
import { useAllWarehouses } from "@/services/hooks/warehouses";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
  shopId: number;
};

export function ComboboxWarehouses({ onSelect, formValue, shopId }: Props) {
  const { data: { data: warehouses = [] } = {} } = useAllWarehouses(shopId);

  const options =
    warehouses.length > 0
      ? warehouses.map((item) => ({
          label: item.name ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  return (
    <Combobox onSelect={onSelect} formValue={formValue} options={options} />
  );
}
