import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "../query";

export const useAllProducts = (shopId: number) => {
  return useAppQuery(ApiQuery.products.getAllProducts({ shopId }));
};
