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
import { ToastTitle, UserRole } from "@/lib/constants";
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
        <DialogTitle className="hidden">Create User</DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <AuthForm
            onSubmit={(formData) => {
              mutate(
                {
                  ...formData,
                  role: isAdmin ? UserRole.ADMIN : UserRole.STAFF,
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
                      description: "Create user success!",
                    });
                    queryClient.invalidateQueries({
                      queryKey: isAdmin
                        ? ApiQuery.users.getUsers().queryKey
                        : ApiQuery.shops.getShopDetails().queryKey,
                    });
                    setOpen(false);
                  },
                }
              );
            }}
            type="sign-up"
            btnText="Create Profile"
          />
        </DialogContent>
        {children}
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Create User</span>
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default CreateUserModal;
