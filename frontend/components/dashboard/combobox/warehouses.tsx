"use client";

import { Combobox } from "./index";
import { useAllWarehouses, useAllZones } from "@/services/hooks/warehouses";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

type WarehouseComboboxProps = Props & { shopId: number };
type ZoneComboboxProps = Props & { warehouseId: number };

export function ComboboxWarehouses({
  onSelect,
  formValue,
  shopId,
}: WarehouseComboboxProps) {
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

export function ComboboxZones({
  onSelect,
  formValue,
  warehouseId,
}: ZoneComboboxProps) {
  const { data: { data: items = [] } = {} } = useAllZones(warehouseId);

  const options =
    items.length > 0
      ? items.map((item) => ({
          label: item.name ?? "",
          value: item.id?.toString() ?? "",
        }))
      : [];

  return (
    <Combobox onSelect={onSelect} formValue={formValue} options={options} />
  );
}
