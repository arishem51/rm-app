import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import ShopModal from "@/components/shop-form";

type Props = {
  children?: ReactNode;
};

const CreateShopModal = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Create Modal</DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <ShopModal onClose={() => setOpen(false)}></ShopModal>
        </DialogContent>
        {children}
        <DialogTrigger asChild>
          <Button>Create a shop!</Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default CreateShopModal;
