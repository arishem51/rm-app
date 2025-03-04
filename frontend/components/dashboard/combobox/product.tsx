"use client";

import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Combobox } from "./index";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxProducts({ onSelect, formValue }: Props) {
  const { data: { data: products = [] } = {} } = useAppQuery(
    ApiQuery.partners.getAllPartners()
  );

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
