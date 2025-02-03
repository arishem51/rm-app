import { UnusedSkipTokenOptions } from "@tanstack/react-query";

export type QueryConfigType<T> = Omit<
  UnusedSkipTokenOptions<T>,
  "queryFn" | "queryKey"
>;

export type PartialByKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
