import React, { ReactNode } from "react";
import MultiHeaderListSearch from "../search/multi-header-list-search";
import { FacilityFilterSearchType } from "./index";
import { cn } from "@/lib/utils";
import { appearanceNone } from "@/lib/constants";

type Props = {
  filter: FacilityFilterSearchType;
  onFilter: (items: Record<keyof FacilityFilterSearchType, string>) => void;
  children: ReactNode;
};

const FacilityHeader = ({ filter, onFilter, children }: Props) => {
  const factoryItems = (props: {
    name: keyof FacilityFilterSearchType;
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
        items={[
          factoryItems({
            inputProps: { label: "Tên kho", placeholder: "Ví dụ: Kho dự trữ" },
            name: "search",
          }),
          factoryItems({
            inputProps: {
              label: "Địa chỉ",
              placeholder: "Ví dụ: Hà Nội",
            },
            name: "address",
          }),
          factoryItems({
            name: "zone",
            inputProps: {
              className: cn("w-32", appearanceNone),
              type: "number",
              label: "Số lượng khu vực",
              placeholder: "Ví dụ: 5",
            },
          }),
        ]}
        onSearchClick={(items) => {
          const searchItems: Record<keyof FacilityFilterSearchType, string> =
            items.reduce(
              (acc, cur) => {
                return {
                  ...acc,
                  [cur.name]: cur.search,
                };
              },
              {} as Record<keyof FacilityFilterSearchType, string>
            );
          onFilter(searchItems);
        }}
      />
      {children}
    </div>
  );
};

export default FacilityHeader;
