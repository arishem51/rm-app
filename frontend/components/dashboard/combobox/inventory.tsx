"use client";

import { Combobox } from "./index";
import { useAllInventories } from "@/services/hooks/inventories";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxInventories({ onSelect, formValue }: Props) {
  const { data: { data: inventories } = {} } = useAllInventories();

  const options =
    (inventories?.data?.length ?? 0) > 0
      ? inventories?.data?.map((item) => ({
          label: item.productName ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  return (
    <Combobox onSelect={onSelect} formValue={formValue} options={options} />
  );
}
