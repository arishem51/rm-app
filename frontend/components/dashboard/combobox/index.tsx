"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import VirtualizedCommand from "@/components/dashboard/combobox/virtualized-combobox";

type Props = {
  onSelect: (value: string) => void;
  formValue?: string;
  options: { value: string; label: string }[];
};

export function Combobox({ onSelect, formValue, options }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(formValue);
  const [buttonHover, setButtonHover] = useState(false);

  useEffect(() => {
    if (formValue && formValue !== value) {
      setValue(formValue);
    }
  }, [formValue, value]);

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
            ? options.find((item) => item.value?.toString() === value)?.label
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
