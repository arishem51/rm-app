"use client";

import useAppQuery from "@/hooks/use-app-query";

import { ApiQuery } from "@/services/query";
import { Separator } from "@/components/ui/separator";
import DetailsPageAlert from "@/components/view/alert/alert-error-details";
import useToastErrorDetailsPage from "@/hooks/use-toast-error-details-page";
import InventoryForm from "./inventory-form";

type Props = {
  id: number;
};

const InventoryDetails = ({ id }: Props) => {
  const { data: { data } = {}, error } = useAppQuery(
    ApiQuery.inventories.getDetails(id)
  );
  useToastErrorDetailsPage(error);

  if (!data) {
    return <DetailsPageAlert />;
  }

  return (
    <div className="w-2/3">
      <Separator className="my-4" />
      <InventoryForm inventory={data} />
    </div>
  );
};

export default InventoryDetails;
