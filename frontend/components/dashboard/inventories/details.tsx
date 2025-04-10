"use client";

import useAppQuery from "@/hooks/use-app-query";

import { ApiQuery } from "@/services/query";
import { Separator } from "@/components/ui/separator";
import DetailsPageAlert from "@/components/view/alert/alert-error-details";
import useToastErrorDetailsPage from "@/hooks/use-toast-error-details-page";
import InventoryForm from "./inventory-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <Separator />
      <div className="my-2 mt-4 flex justify-end">
        <Button asChild>
          <Link href={`/dashboard/warehouses/inventories/${id}/history`}>
            Lịch sử chỉnh sửa
          </Link>
        </Button>
      </div>
      <InventoryForm inventory={data} />
    </div>
  );
};

export default InventoryDetails;
