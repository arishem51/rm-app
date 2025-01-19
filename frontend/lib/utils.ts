import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Api } from "@/types/Api";
import { globalStore } from "@/store";
import { userAtom } from "@/store/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiClient = new Api({
  baseUrl: "http://localhost:8080",
  customFetch: async (url, init) => {
    const options = init ? init : {};
    options.headers = {
      ...options.headers,

      "Authorization-Provider": "microsoft",
      "Accept-Language": "vi-VN",
    };
    const token = globalStore.get(userAtom)?.token;
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return fetch(url, options);
  },
});
