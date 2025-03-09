"use client";

import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Combobox } from "./index";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxSuppliers({ onSelect, formValue }: Props) {
  const { data: { data: suppliers = [] } = {} } = useAppQuery(
    ApiQuery.partners.getAllPartners()
  );

  const options =
    suppliers.length > 0
      ? suppliers.map((item) => ({
          label: item.name ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  return (
    <Combobox onSelect={onSelect} formValue={formValue} options={options} />
  );
}
