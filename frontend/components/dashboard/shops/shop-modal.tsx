"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import ShopForm from "@/components/form/shop-form";
import { Plus } from "lucide-react";

type Props = {
  children?: ReactNode;
  trigger?: ReactNode;
};

const ShopModal = ({ children, trigger }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Create Modal</DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <ShopForm onClose={() => setOpen(false)} />
        </DialogContent>
        {children}
        <DialogTrigger asChild>
          {trigger ?? (
            <Button>
              <Plus />
              <span>Create Shop</span>
            </Button>
          )}
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default ShopModal;
