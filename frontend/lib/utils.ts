import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Api } from "@/types/Api";
import { globalStore } from "@/store";
import { authAtom } from "@/store/auth";
import { queryOptions } from "@tanstack/react-query";
import { QueryConfigType } from "@/types";
import { isEmpty } from "lodash";

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

const serialize = <T>(record?: Record<string, string | number | T>) => {
  const result: Record<string, string> = {};
  for (const key in record) {
    if (key !== "search" && !isEmpty(record[key])) {
      result[key] = String(record[key]);
    }
  }
  return result;
};

export const createQuery = <T, K>(
  method: (args: K) => Promise<{ data: T }>,
  queryConfig?: ((params: K) => QueryConfigType<T>) | QueryConfigType<T>
) => {
  return (params: K = {} as K) => {
    const config =
      typeof queryConfig === "function" ? queryConfig(params) : queryConfig;
    const queryKey: (string | K | Record<string, string>)[] = [method.name];
    if (
      (typeof params !== "object" && params) ||
      Object.keys(params ?? {}).length > 0
    ) {
      queryKey.push(
        typeof params === "object"
          ? serialize(params as Record<string, string>)
          : params
      );
    }
    return queryOptions<T>({
      queryKey,
      queryFn: async () => {
        const { data } = await method(params);
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
