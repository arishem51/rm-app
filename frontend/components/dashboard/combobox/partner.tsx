"use client";

import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Combobox } from "./index";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxPartners({ onSelect, formValue }: Props) {
  const { data: { data: partners = [] } = {} } = useAppQuery(
    ApiQuery.partners.getAllPartners()
  );

  const options =
    partners.length > 0
      ? partners.map((item) => ({
          label: item.name ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  return (
    <Combobox onSelect={onSelect} formValue={formValue} options={options} />
  );
}
