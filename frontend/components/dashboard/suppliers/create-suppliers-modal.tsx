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
import SupplierForm from "@/components/supplier-form";
import { useCreateSupplier } from "@/hooks/mutations/suppliers";

type Props = {
  children?: ReactNode;
  isAdmin?: boolean;
};

const CreateSuppliersModal = ({ children, isAdmin = false }: Props) => {
  const { mutate } = useCreateSupplier();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center justify-between">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Create Supplier</DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <SupplierForm
            onSubmit={(formData) => {
              console.log("Check formData: ", formData);
              mutate(
                {
                  ...formData,
                },
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
                      description: "Create supplier success!",
                    });
                    queryClient.invalidateQueries({
                      queryKey: ApiQuery.suppliers.getSuppliers().queryKey,
                    });
                    setOpen(false);
                  },
                }
              );
            }}
            type="sign-up"
            btnText="Create Supplier"
          />
        </DialogContent>
        {children}
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Create Supplier</span>
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default CreateSuppliersModal;
