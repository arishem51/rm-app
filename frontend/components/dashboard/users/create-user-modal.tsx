import AuthForm from "@/components/auth-form";
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
};

const CreateUserModal = ({ children }: Props) => {
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
                { ...formData, role: UserRole.ADMIN },
                {
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
                      description: "Create user success!",
                    });
                    queryClient.invalidateQueries({
                      queryKey: ApiQuery.users.getUsers().queryKey,
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
