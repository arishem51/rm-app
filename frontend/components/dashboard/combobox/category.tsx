"use client";

import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Combobox } from "./index";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxCategories({ onSelect, formValue }: Props) {
  const { data: { data: categories = [] } = {} } = useAppQuery(
    ApiQuery.categories.getAllCategories()
  );

  const options =
    categories.length > 0
      ? categories.map((item) => ({
          label: item.name ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  return (
    <Combobox onSelect={onSelect} formValue={formValue} options={options} />
  );
}
