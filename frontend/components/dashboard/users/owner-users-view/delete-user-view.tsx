import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/mutations/user";
import { toast } from "@/hooks/use-toast";
import { ApiQuery } from "@/services/query";
import { UserDTO } from "@/types/Api";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  user: UserDTO;
};

const DeleteUserView = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const queryClient = useQueryClient();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          className="w-6 h-6 ml-1"
          variant="destructive"
          onClick={() => {}}
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={() => {
              updateUser(
                { ...user, status: "INACTIVE" },
                {
                  onSuccess: () => {
                    toast({
                      variant: "default",
                      title: "Success",
                      description: "Delete successfully",
                    });
                    queryClient.invalidateQueries({
                      queryKey: ApiQuery.shops.getShopDetails().queryKey,
                    });
                    setOpen(false);
                  },
                }
              );
            }}
          >
            {isPending ? "Saving..." : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserView;
