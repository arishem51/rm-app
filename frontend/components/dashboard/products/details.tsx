"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useAppQuery from "@/hooks/use-app-query";
import { toast } from "@/hooks/use-toast";
import { ToastTitle } from "@/lib/constants";
import { ApiQuery } from "@/services/query";
import { HttpErrorResponse } from "@/types";
import { useEffect } from "react";
import ProductForm from "./product-form";
import { Separator } from "@/components/ui/separator";

type Props = {
  id: number;
};

const ProductDetails = ({ id }: Props) => {
  const { data: { data } = {}, error = {} } = useAppQuery(
    ApiQuery.products.getProduct(id)
  );

  useEffect(() => {
    const stackError = (error as unknown as HttpErrorResponse)?.error;
    if (stackError?.message) {
      toast({
        title: ToastTitle.error,
        description: stackError.message,
        variant: "destructive",
      });
    }
  }, [error]);

  if (!data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-2/3">
      <Separator className="my-4" />
      <ProductForm product={data} />
    </div>
  );
};

export default ProductDetails;
