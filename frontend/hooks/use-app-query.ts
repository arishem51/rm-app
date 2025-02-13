import { BaseResponseUser, HttpResponse } from "@/types/Api";
import {
  DefaultError,
  QueryKey,
  UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

function useAppQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const { error, ...rest } = useQuery(options);
  if (error) {
    const e = error as unknown as
      | HttpResponse<null, BaseResponseUser>
      | undefined;
    const { errorCode } = e?.error ?? {};
    if (errorCode === "TOKEN_EXPIRED" || errorCode === "TOKEN_INVALID") {
      redirect("/auth/sign-in");
    }
  }

  return { error, ...rest };
}

export default useAppQuery;
