import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Api } from "@/types/Api";
import { globalStore } from "@/store";
import { authAtom } from "@/store/auth";
import { queryOptions } from "@tanstack/react-query";
import { QueryConfigType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const { api: apiClient } = new Api({
  baseUrl: "http://localhost:8080",
  baseApiParams: {
    format: "json",
  },
  customFetch: async (url, init) => {
    const options = init ?? {};
    options.headers = {
      ...options.headers,
      format: "json",
    };
    let token;

    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      token = (await cookies()).get("token")?.value;
    } else {
      token = globalStore.get(authAtom)?.token;
    }
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    const response = await fetch(url, options);
    if (
      !response.ok &&
      response.status === 401 &&
      token &&
      typeof window !== "undefined"
    ) {
      globalStore.set(authAtom, {
        token: "",
        showToastErrorSignIn: true,
      });
    }
    return response;
  },
});

function getArgumentNames<K extends unknown[]>(
  func: (...args: K) => unknown
): string[] {
  const functionString = func.toString();
  const match = functionString.match(/\(([^)]*)\)/);
  if (!match) {
    return [];
  }
  const args = match[1].split(",").reduce((acc: string[], arg: string) => {
    const trimmedArg = arg.trim();
    const isArgHaveDefaultValue = trimmedArg.includes("=");

    if (trimmedArg) {
      acc.push(
        isArgHaveDefaultValue ? trimmedArg.split("=")[0].trim() : trimmedArg
      );
    }
    return acc;
  }, []);

  return args;
}

const mapParamsFromFunc = <K extends unknown[]>(
  params: K,
  func: (...args: K) => unknown
) => {
  const args = getArgumentNames(func);
  const result: Record<string, unknown> = {};

  for (const param in params) {
    const paramValue = params[param];
    const paramKey = args[param];
    result[paramKey] = paramValue;
  }

  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createQuery = <T, K extends any[]>(
  method: (...args: K) => Promise<{ data: T }>,
  queryConfig?: ((params: K) => QueryConfigType<T>) | QueryConfigType<T>
) => {
  return (...params: K) => {
    const config =
      typeof queryConfig === "function" ? queryConfig(params) : queryConfig;
    const queryKey: (string | K | Record<string, unknown>)[] = [method.name];
    if (
      (typeof params !== "object" && params) ||
      Object.keys(params ?? {}).length > 0
    ) {
      queryKey.push(
        typeof params === "object" ? mapParamsFromFunc(params, method) : params
      );
    }
    return queryOptions<T>({
      queryKey,
      queryFn: async () => {
        const { data } = await method(...params);
        return data;
      },
      ...config,
    });
  };
};

export const toCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const createSttNumber = (
  index: number,
  page: number,
  pageSize: number = 10
) => {
  return page * pageSize + index + 1;
};

// utils/numberToWords.ts

const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const teens = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
const thousands = ["", "nghìn", "triệu", "tỷ"];

export function numberToVietnameseWords(num: number): string {
  if (num === 0) return "không";
  if (num < 0) return "âm " + numberToVietnameseWords(-num);

  let words: string[] = [];
  let parts: string[] = [];
  let i = 0;

  while (num > 0) {
    const part = num % 1000;
    if (part !== 0) {
      parts.unshift(readThreeDigits(part) + " " + thousands[i]);
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function readThreeDigits(num: number): string {
  const hundred = Math.floor(num / 100);
  const tenUnit = num % 100;
  const ten = Math.floor(tenUnit / 10);
  const unit = tenUnit % 10;
  let result = "";

  if (hundred > 0) {
    result += `${units[hundred]} trăm`;
    if (tenUnit === 0) return result;
    if (ten === 0) result += " linh";
  }

  if (ten === 1) {
    result += ` ${teens[unit]}`;
  } else if (ten > 1) {
    result += ` ${tens[ten]}`;
    if (unit === 1) result += " mốt";
    else if (unit === 5) result += " lăm";
    else if (unit > 0) result += ` ${units[unit]}`;
  } else if (ten === 0 && unit > 0) {
    result += ` ${units[unit]}`;
  }

  return result.trim();
}

