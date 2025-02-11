import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Shop, UpdateShopRequest } from "@/types/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useUpdateUser } from "@/hooks/mutations/user";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";

const schemaFields = {
  name: z.string().nonempty({ message: "Name is required" }),
  address: z
    .string()
    .regex(/^[0-9]{10,12}$/, {
      message: "Phone number must be 10-12 digits long",
    })
    .nonempty({ message: "Phone number is required" }),
};

type Props = {
  children?: ReactNode;
  shop?: Shop;
};

const UpdateShopModal = ({ children, shop }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateShopRequest>({
    defaultValues: {
      name: "",
      address: "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });
  const { mutate: updateUser, isPending } = useUpdateUser();
  const queryClient = useQueryClient();

  const { setValue } = form;
  useEffect(() => {
    if (shop) {
      setValue("name", shop.name as string);
      setValue("address", shop.address as string);
    }
  }, [setValue, shop]);

  const handleSubmit = form.handleSubmit((data: UpdateShopRequest) => {
    if (shop?.id) {
      updateUser(
        { id: shop.id, ...data },
        {
          onSuccess: () => {
            toast({
              variant: "default",
              title: "Success",
              description: "Shop updated successfully",
            });
            queryClient.invalidateQueries({
              queryKey: ApiQuery.users.getUsers().queryKey,
            });
            setOpen(false);
          },
        }
      );
    }
  });

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit} className="mt-4">
            <DialogHeader>
              <DialogTitle>Edit shops</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 my-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default UpdateShopModal;
