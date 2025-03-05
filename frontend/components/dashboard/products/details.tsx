"use client";

import useAppQuery from "@/hooks/use-app-query";

import { ApiQuery } from "@/services/query";
import ProductForm from "./product-form";
import { Separator } from "@/components/ui/separator";
import DetailsPageAlert from "@/components/view/details-page-alert";
import useToastErrorDetailsPage from "@/hooks/use-toast-error-details-page";

type Props = {
  id: number;
};

const ProductDetails = ({ id }: Props) => {
  const { data: { data } = {}, error } = useAppQuery(
    ApiQuery.products.getProduct(id)
  );
  useToastErrorDetailsPage(error);

  if (!data) {
    return <DetailsPageAlert />;
  }

  return (
    <div className="w-2/3">
      <Separator className="my-4" />
      <ProductForm product={data} />
    </div>
  );
};

export default ProductDetails;
