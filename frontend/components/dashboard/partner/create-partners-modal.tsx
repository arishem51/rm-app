import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import PartnerForm from "@/components/partner-form";
import { useCreatePartner } from "@/hooks/mutations/partner";

const CreatePartnersModal = () => {
  const { mutate } = useCreatePartner();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Create Partner</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <PartnerForm
            onSubmit={(formData) => {
              mutate(formData, {
                onSuccess: () => {
                  toast({ title: "Success", description: "Partner created!" });
                  queryClient.invalidateQueries({
                    queryKey: ApiQuery.partners.getPartners().queryKey,
                  });
                  setOpen(false);
                },
                onError: (error) => {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message,
                  });
                },
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePartnersModal;