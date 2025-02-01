import { UserPen } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUpdateUser } from "@/hooks/mutations/user";
import { User } from "@/types/Api";
import { UserStatus } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type Props = {
  isAdmin: boolean;
  user: User;
};
const UserActions = ({ isAdmin, user }: Props) => {
  const { mutate: updateUser } = useUpdateUser();

  return (
    <AlertDialog>
      <AlertDialogContent
        onCloseAutoFocus={() => {
          if (document.body.style.pointerEvents === "none") {
            document.body.style.pointerEvents = "";
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              updateUser({ ...user, status: UserStatus.INACTIVE });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      <Button size="icon" className="w-6 h-6" variant="outline">
        <UserPen />
      </Button>
    </AlertDialog>
  );
};

export default UserActions;
