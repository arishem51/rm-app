import React, { ReactNode, useState } from "react";
import MultiHeaderListSearch from "../search/multi-header-list-search";
import { FilterSearchType } from "./index";
import { Label } from "@/components/ui/label";

import { ComboboxCategories } from "../combobox/category";

type Props = {
  filter: FilterSearchType;
  onFilter: (items: Record<keyof FilterSearchType, string>) => void;
  children?: ReactNode;
};

const ProductHeader = ({ filter, onFilter, children }: Props) => {
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

  return (
    <div className="flex items-center justify-between">
      <MultiHeaderListSearch
        className="w-5/6"
        items={[
          factoryItems({
            inputProps: {
              label: "Tên sản phẩm",
              placeholder: "Ví dụ: Gạo nếp",
            },
            name: "search",
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
          <Label>Tên Danh mục</Label>
          <ComboboxCategories
            onSelect={(id) => {
              setInnerFilter((prev) => {
                return {
                  ...prev,
                  search: prev?.search || "",
                  categoryId: innerFilter?.categoryId === id ? "" : id,
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
