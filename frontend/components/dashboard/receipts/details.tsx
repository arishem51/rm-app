"use client";

import useAppQuery from "@/hooks/use-app-query";

import { ApiQuery } from "@/services/query";
import { Separator } from "@/components/ui/separator";
import DetailsPageAlert from "@/components/view/alert/alert-error-details";
import useToastErrorDetailsPage from "@/hooks/use-toast-error-details-page";
import ReceiptForm from "./receipt-form";

type Props = {
  id: number;
};

const ReceiptDetails = ({ id }: Props) => {
  const { data: { data } = {}, error } = useAppQuery(
    ApiQuery.receipts.getReceipt(id)
  );
  useToastErrorDetailsPage(error);

  if (!data) {
    return <DetailsPageAlert />;
  }

  return (
    <div className="w-2/3">
      <Separator className="my-4" />
      <ReceiptForm receipt={data} />
    </div>
  );
};

export default ReceiptDetails;
