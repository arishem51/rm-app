import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { User } from "@/types/Api";
import ListUserContent from "./list-user-content";

type Props = {
  children?: ReactNode;
  name?: string;
  data?: User[];
};

const ListUserModal = ({ children, name, data }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Create Modal</DialogTitle>
        <DialogContent className="sm:max-w-[1000px]">
          <ListUserContent onClose={() => setOpen(false)}></ListUserContent>
        </DialogContent>
        {/* {children} */}
        <DialogTrigger asChild>
          <Button
            variant="link"
            onClick={() => setOpen(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            {name}
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default ListUserModal;
