"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, CircleX, Delete, DeleteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import VirtualizedCommand from "@/components/virtualized-combobox";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
};

export function ComboboxCategories({ onSelect, formValue }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(formValue);
  const [buttonHover, setButtonHover] = useState(false);

  const { data: { data: categories = [] } = {} } = useAppQuery(
    ApiQuery.categories.getAllCategories()
  );

  useEffect(() => {
    if (formValue && formValue !== value) {
      setValue(formValue);
    }
  }, [formValue, value]);

  const options =
    categories?.length > 0
      ? categories.map((item) => ({
          value: item.id?.toString() ?? "",
          label: item.name ?? "",
        }))
      : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between w-full"
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {value
            ? categories?.find((item) => item.id?.toString() === value)?.name
            : "Search items..."}
          {buttonHover ? (
            <CircleX
              size={16}
              onClick={(e) => {
                e.stopPropagation();
                setValue("");
                onSelect("");
              }}
              className="!pointer-events-auto"
            />
          ) : (
            <ChevronsUpDown size={16} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <VirtualizedCommand
          height="auto"
          options={options}
          placeholder={"Search items..."}
          selectedOption={value?.toString() ?? ""}
          onSelectOption={(currentValue) => {
            setValue(currentValue === value?.toString() ? "" : currentValue);
            setOpen(false);
            onSelect(currentValue);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
