import { BaseResponseUserDTO, HttpResponse } from "@/types/Api";
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

function useAppQuery<
  TQueryFnData = unknown,
  TError = HttpResponse<null>,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const { error, ...rest } = useQuery({
    ...options,
    select:
      options.select ??
      ((data) => {
        return data as unknown as TData;
      }),
  });
  if (error) {
    const e = error as unknown as
      | HttpResponse<null, BaseResponseUserDTO>
      | undefined;
    const { errorCode } = e?.error ?? {};
    if (errorCode === "TOKEN_EXPIRED" || errorCode === "TOKEN_INVALID") {
      redirect("/auth/sign-in");
    }
  }

  return { error, ...rest };
}

export default useAppQuery;
