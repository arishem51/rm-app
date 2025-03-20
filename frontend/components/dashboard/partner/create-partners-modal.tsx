import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { ToastTitle } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import PartnerForm from "@/components/partner-form";
// import { useCreateUser } from "@/hooks/mutations/user";
import { useCreatePartner } from "@/hooks/mutations/partner";

type Props = {
  children?: ReactNode;
  isAdmin?: boolean;
};

const CreatePartnersModal = ({ children}: Props) => {
  const { mutate, isPending } = useCreatePartner();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center justify-between">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Create Partner</DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <PartnerForm
            onSubmit={(formData) => {
              mutate(
                formData,
                {
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
                      description: "Partner created successfully!",
                    });
                    queryClient.invalidateQueries({
                      queryKey: ApiQuery.partners.getPartners().queryKey,
                    });
                    setOpen(false);
                  },
                }
              );
            }}
            btnText="Create Partner"
          />
        </DialogContent>
        {children}
        <DialogTrigger asChild>
          <Button disabled={isPending}>
            <Plus className="mr-1" />
            <span>Create Partner</span>
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default CreatePartnersModal;
