import { UnusedSkipTokenOptions } from "@tanstack/react-query";

export type QueryConfigType<T> = Omit<
  UnusedSkipTokenOptions<T>,
  "queryFn" | "queryKey"
>;
