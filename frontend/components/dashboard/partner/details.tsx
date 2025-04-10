"use client";

import useAppQuery from "@/hooks/use-app-query";

import { ApiQuery } from "@/services/query";
import { Separator } from "@/components/ui/separator";
import DetailsPageAlert from "@/components/view/alert/alert-error-details";
import useToastErrorDetailsPage from "@/hooks/use-toast-error-details-page";
import PartnerForm from "@/components/partner-form";
import { useUpdatePartner } from "@/hooks/mutations/partner";
import { toast } from "@/hooks/use-toast";
import { ToastTitle } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
};

const PartnerDetails = ({ id }: Props) => {
  const { data: { data } = {}, error } = useAppQuery(
    ApiQuery.partners.getPartnerById(id)
  );
  useToastErrorDetailsPage(error);

  const { mutate: updatePartner } = useUpdatePartner();
  const queryClient = useQueryClient();
  const router = useRouter();

  if (!data) {
    return <DetailsPageAlert />;
  }

  return (
    <div className="w-2/3">
      <Separator className="my-4" />
      <PartnerForm
        btnText="Lưu"
        onSubmit={(formData) => {
          updatePartner(
            {
              id: data.id!,
              ...formData,
            },
            {
              onSuccess: () => {
                toast({
                  title: ToastTitle.success,
                  description: "Lưu đối tác thành công",
                });
                queryClient.invalidateQueries({
                  queryKey: ApiQuery.partners.getPartners().queryKey,
                });
                router.push("/dashboard/partners/");
              },
              onError: (e) => {
                toast({
                  variant: "destructive",
                  title: ToastTitle.error,
                  description: e.message,
                });
              },
            }
          );
        }}
        partner={data}
      />
    </div>
  );
};

export default PartnerDetails;
