import AuthForm from "@/components/form/auth-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { useCreateUser } from "@/hooks/mutations/user";
import { ToastTitle } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";

type Props = {
  children?: ReactNode;
  isAdmin?: boolean;
};

const CreateUserModal = ({ children, isAdmin = false }: Props) => {
  const { mutate } = useCreateUser();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center justify-between">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <AuthForm
            requireEmail={false}
            onSubmit={(formData) => {
              mutate(formData, {
                onError: (error) => {
                  toast({
                    title: ToastTitle.error,
                    description: error.message,
                    variant: "destructive",
                  });
                },
                onSuccess: () => {
                  toast({
                    title: ToastTitle.success,
                    description: "Tạo tài khoản thành công!",
                  });
                  queryClient.invalidateQueries({
                    queryKey: isAdmin
                      ? ApiQuery.users.getUsers().queryKey
                      : ApiQuery.shops.getShopDetails().queryKey,
                  });
                  setOpen(false);
                },
              });
            }}
            type="sign-up"
            btnText="Tạo tài khoản"
          />
        </DialogContent>
        {children}
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Tạo tài khoản</span>
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default CreateUserModal;
