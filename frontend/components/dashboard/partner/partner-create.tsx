"use client";

import PartnerForm from "@/components/partner-form";
import { useCreatePartner } from "@/hooks/mutations/partner";
import { toast } from "@/hooks/use-toast";
import { ToastTitle } from "@/lib/constants";
import { ApiQuery } from "@/services/query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

const PartnerCreate = () => {
  const { mutate } = useCreatePartner();
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <PartnerForm
      onSubmit={(formData) => {
        mutate(formData, {
          onError: (error) => {
            toast({
              variant: "destructive",
              title: ToastTitle.error,
              description: error.message,
            });
          },
          onSuccess: () => {
            toast({
              title: ToastTitle.success,
              description: "Tạo đối tác thành công!",
            });
            queryClient.invalidateQueries({
              queryKey: ApiQuery.partners.getPartners().queryKey,
            });
            router.push("/dashboard/partner");
          },
        });
      }}
      btnText="Tạo"
    />
  );
};

export default PartnerCreate;
