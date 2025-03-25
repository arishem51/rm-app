import React, { ReactNode } from "react";
import MultiHeaderListSearch from "../search/multi-header-list-search";
import { FacilityFilterSearchType } from "./index";
import { cn } from "@/lib/utils";
import { appearanceNone } from "@/lib/constants";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { vi } from "date-fns/locale";
import { Label } from "@/components/ui/label";

type Props = {
  filter: FacilityFilterSearchType;
  onFilter: (items: Record<keyof FacilityFilterSearchType, string>) => void;
  children: ReactNode;
};

const FacilityHeader = ({ filter, onFilter, children }: Props) => {
  const [date, setDate] = React.useState<DateRange | undefined>();
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
          console.log(date);
          onFilter({
            ...searchItems,
            startDate: date?.from ? format(date.from, "yyyy-MM-dd") : "",
            endDate: date?.to ? format(date.to, "yyyy-MM-dd") : "",
          });
        }}
      >
        <div className="grid gap-2 self-end">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex flex-col gap-1">
                <Label>Chọn thời điểm tạo</Label>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y", { locale: vi })} -{" "}
                        {format(date.to, "LLL dd, y", { locale: vi })}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y", { locale: vi })
                    )
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date ?? undefined}
                onSelect={setDate}
                numberOfMonths={2}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </MultiHeaderListSearch>
      {children}
    </div>
  );
};

export default FacilityHeader;
