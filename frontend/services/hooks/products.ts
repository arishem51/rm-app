import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "../query";

export const useAllProducts = () => {
  return useAppQuery(ApiQuery.products.getAllProducts());
};
