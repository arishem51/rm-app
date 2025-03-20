"use client";

import { Combobox } from "./index";
import { useAllPartners } from "@/services/hooks/partners";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxPartners({ onSelect, formValue }: Props) {
  const { data: { data: partners = [] } = {} } = useAllPartners();

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
