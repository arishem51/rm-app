import { UnusedSkipTokenOptions } from "@tanstack/react-query";
import { HttpResponse } from "./Api";

export type QueryConfigType<T> = Omit<
  UnusedSkipTokenOptions<T>,
  "queryFn" | "queryKey"
>;

export type PartialByKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type UserRoleType = "ADMIN" | "STAFF" | "OWNER";

export type RouteItem = {
  url: string;
  accessRoles: UserRoleType[];
};
export type AppRoutesType = {
  [key: string]: RouteItem | AppRoutesType;
};

export type HttpErrorResponse = HttpResponse<
  null,
  {
    data: null;
    errorCode: number;
    message: string;
  }
>;
