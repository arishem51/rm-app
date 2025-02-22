import { UnusedSkipTokenOptions } from "@tanstack/react-query";

export type QueryConfigType<T> = Omit<
  UnusedSkipTokenOptions<T>,
  "queryFn" | "queryKey"
>;

export type PartialByKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type UserRoleType = "ADMIN" | "STAFF" | "OWNER";

export type RouteItem = {
  url: string;
  role: UserRoleType | "ALL";
};
export type AppRoutesType = {
  [key: string]: RouteItem | AppRoutesType;
};
