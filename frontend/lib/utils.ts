import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Api } from "@/types/Api";
import { globalStore } from "@/store";
import { userAtom } from "@/store/user";
import { UnusedSkipTokenOptions, queryOptions } from "@tanstack/react-query";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const { api: apiClient } = new Api({
  baseUrl: "http://localhost:8080",
  baseApiParams: {
    format: "json",
  },
  customFetch: async (url, init) => {
    const options = init ? init : {};
    options.headers = {
      ...options.headers,
      format: "json",
    };
    let token;

    if (typeof window === "undefined") {
      // Running on the server: Get token from cookies
      const { cookies } = await import("next/headers");
      token = (await cookies()).get("token")?.value;
    } else {
      // Running on the client: Get token from globalStore
      token = globalStore.get(userAtom)?.token;
    }
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return fetch(url, options);
  },
});

const serialize = <T>(record?: Record<string, string | number | T>) => {
  const result: Record<string, string> = {};
  for (const key in record) {
    result[key] = String(record[key]);
  }
  return result;
};

export const createQuery = <T, K>(
  method: (args: K) => Promise<{ data: T }>,
  queryConfig?:
    | ((params: K) => UnusedSkipTokenOptions<T>)
    | UnusedSkipTokenOptions<T>
) => {
  return (params: K = undefined as K) => {
    const config =
      typeof queryConfig === "function" ? queryConfig(params) : queryConfig;
    return queryOptions<T>({
      queryKey: [
        method.name,
        typeof params === "object"
          ? serialize(params as Record<string, unknown>)
          : params,
      ],
      queryFn: async () => {
        const { data } = await method(params);
        return data;
      },
      ...config,
    });
  };
};
