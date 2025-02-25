"use client";

import * as React from "react";
import { useEffect, useReducer } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { toCurrency } from "@/lib/utils";

type InputProps = React.ComponentProps<"input">;
export type InputCurrencyProps<T extends FieldValues> = InputProps & {
  name: Path<T>;
  label?: string;
};

function InputCurrency<T extends FieldValues>({
  name,
  label,
  ...props
}: InputCurrencyProps<T>) {
  const { watch, control } = useFormContext();
  const formValue = watch(name);

  const [value, setValue] = useReducer((_: string, next: string) => {
    if (!next) return "";
    const numericValue = Number(next.replace(/\D/g, ""));
    return numericValue ? toCurrency(numericValue) : "";
  }, "");

  useEffect(() => {
    setValue(formValue ? formValue.toString() : "");
  }, [formValue]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              id={name}
              type="text"
              {...props}
              {...field}
              onChange={(ev) => {
                const inputValue = ev.target.value;
                setValue(inputValue);
                const numericValue = Number(inputValue.replace(/\D/g, ""));
                field.onChange(numericValue || 0);
              }}
              onKeyDown={(ev) => {
                if (ev.key === "Backspace") {
                  ev.preventDefault();
                  const raw = value.replace(/\D/g, "");
                  const newRaw = raw.slice(0, -1);
                  const newNumber = Number(newRaw) || 0;
                  field.onChange(newNumber);
                  setValue(newRaw ? toCurrency(newNumber) : "");
                }
              }}
              value={value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InputCurrency;
