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
      // Running on the server: Get token from cookies
      const { cookies } = await import("next/headers");
      token = (await cookies()).get("token")?.value;
    } else {
      // Running on the client: Get token from globalStore
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
    result[key] = String(record[key]);
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
