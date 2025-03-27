import React, { ReactNode, useState } from "react";
import MultiHeaderListSearch from "../search/multi-header-list-search";
import { FilterSearchType } from "./index";
import { ComboboxWarehouses } from "../combobox/warehouses";
import { Label } from "@/components/ui/label";
import { useMe } from "@/hooks/mutations/user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllZonesByShop } from "@/services/hooks/warehouses";
import { ZoneDTO } from "@/types/Api";
import { ComboboxCategories } from "../combobox/category";
import { ComboboxPartners } from "../combobox/partner";

type Props = {
  filter: FilterSearchType;
  onFilter: (items: Record<keyof FilterSearchType, string>) => void;
  children: ReactNode;
};

const ProductHeader = ({ filter, onFilter, children }: Props) => {
  const { data: meQuery } = useMe();
  const [innerFilter, setInnerFilter] = useState<FilterSearchType>();
  const factoryItems = (props: {
    name: keyof FilterSearchType;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
      label?: string;
    };
  }) => {
    return {
      filterSearch: filter[props.name],
      name: props.name,
      inputProps: props.inputProps,
    };
  };

  const { data: zoneQuery = {} } = useAllZonesByShop();
  const { data: zones = [] } = zoneQuery;
  const groupZoneByWarehouseId = zones.reduce(
    (acc, zone) => {
      if (!acc[zone.warehouseId!]) {
        acc[zone.warehouseId!] = {
          warehouseId: zone.warehouseId!,
          warehouseName: zone.warehouseName,
          zones: [zone],
        };
      } else {
        acc[zone.warehouseId!].zones.push(zone);
      }
      return acc;
    },
    {} as Record<
      number,
      { warehouseId: number; warehouseName?: string; zones: ZoneDTO[] }
    >
  );

  return (
    <div className="flex items-center justify-between my-2">
      <MultiHeaderListSearch
        className="w-5/6 my-0"
        items={[
          factoryItems({
            inputProps: {
              label: "Tên sản phẩm",
              placeholder: "Ví dụ: Gạo nếp",
            },
            name: "search",
          }),
          factoryItems({
            inputProps: {
              label: "Giá",
              placeholder: "Ví dụ: 10000",
            },
            name: "price",
          }),
          factoryItems({
            inputProps: {
              label: "Số lượng",
              placeholder: "Ví dụ: 10",
            },
            name: "quantity",
          }),
        ]}
        onSearchClick={(items) => {
          const searchItems: Record<keyof FilterSearchType, string> =
            items.reduce(
              (acc, cur) => {
                return {
                  ...acc,
                  [cur.name]: cur.search,
                };
              },
              {} as Record<keyof FilterSearchType, string>
            );
          onFilter({
            ...searchItems,
            ...innerFilter,
          });
        }}
      >
        <div className="mt-2">
          <Label>Tên kho</Label>
          <ComboboxWarehouses
            shopId={meQuery!.shopId!}
            onSelect={(id) => {
              setInnerFilter((prev) => {
                return {
                  ...prev,
                  search: prev?.search || "",
                  warehouseId: id,
                };
              });
            }}
          />
        </div>
        <div className="mt-2">
          <Label>Tên Khu</Label>
          <Select
            onValueChange={(value) => {
              setInnerFilter((prev) => {
                return {
                  ...prev,
                  search: prev?.search || "",
                  zoneId: value,
                };
              });
            }}
            value={innerFilter?.zoneId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn kho - khu trong kho" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupZoneByWarehouseId).map(([key, value]) => {
                return (
                  <SelectGroup key={key}>
                    <SelectLabel>Tên Kho: {value.warehouseName}</SelectLabel>
                    {value.zones.map((zone) => {
                      const id = zone.id!.toString();
                      return (
                        <SelectItem
                          key={id}
                          value={id.toString()}
                          className="ml-2"
                        >
                          {zone.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          <Label>Tên Danh mục</Label>
          <ComboboxCategories
            onSelect={(id) => {
              setInnerFilter((prev) => {
                return {
                  ...prev,
                  search: prev?.search || "",
                  categoryId: id,
                };
              });
            }}
          />
        </div>
        <div className="mt-2">
          <Label>Tên nhà cung cấp</Label>
          <ComboboxPartners
            onSelect={(id) => {
              setInnerFilter((prev) => {
                return {
                  ...prev,
                  search: prev?.search || "",
                  supplierId: id,
                };
              });
            }}
          />
        </div>
      </MultiHeaderListSearch>
      {children}
    </div>
  );
};

export default ProductHeader;
