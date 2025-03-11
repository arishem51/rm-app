"use client";

import useAppQuery from "@/hooks/use-app-query";
import useToastErrorDetailsPage from "@/hooks/use-toast-error-details-page";
import DetailsPageAlert from "@/components/view/alert/alert-error-details";
import { ApiQuery } from "@/services/query";
import FacilityForm from "./facility-form";
import { Separator } from "@/components/ui/separator";

type Props = { id: number };

const FacilityDetails = ({ id }: Props) => {
  const { data: { data: warehouse } = {}, error } = useAppQuery(
    ApiQuery.warehouses.getDetails(id)
  );
  const { data: { data: zones } = {} } = useAppQuery(
    ApiQuery.zones.getAllByWarehouse(id)
  );
  useToastErrorDetailsPage(error);

  if (!warehouse) {
    return <DetailsPageAlert />;
  }

  return (
    <div className="w-2/3">
      <Separator className="my-4" />
      <FacilityForm warehouse={warehouse} zones={zones ?? []} />
    </div>
  );
};

export default FacilityDetails;
