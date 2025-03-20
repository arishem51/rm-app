import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "../query";

export const useAllPartners = () => {
  return useAppQuery(ApiQuery.partners.getAllPartners());
};
