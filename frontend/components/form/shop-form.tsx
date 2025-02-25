import { useForm } from "react-hook-form";
import { CreateShopDTO, ShopDTO } from "@/types/Api";
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
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCreateShop, useUpdateShop } from "@/hooks/mutations/shop";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { useEffect } from "react";
import { UserRole } from "@/lib/constants";
import { useMe } from "@/hooks/mutations/user";
import { useRouter } from "next/navigation";

const schemaFields = {
  name: z.string().nonempty({ message: "Name is required" }),
  address: z.string().nonempty({ message: "Address is required" }),
};

type Props = {
  onClose?: () => void;
  shop?: ShopDTO;
};

const ShopForm = ({ onClose, shop }: Props) => {
  const form = useForm<CreateShopDTO>({
    defaultValues: shop ?? { name: "", address: "" },
    resolver: zodResolver(z.object(schemaFields)),
  });
  const { mutate: createShop, isPending: isCreating } = useCreateShop();
  const { mutate: updateShop, isPending: isUpdating } = useUpdateShop();
  const isPending = isCreating || isUpdating;
  const queryClient = useQueryClient();
  const { data: user } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (shop) {
      form.reset(shop);
    }
  }, [form, shop]);

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      variant: "default",
      title: "Success",
      description: `${type === "create" ? "Create" : "Update"} shop successfully`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.shops.getShops().queryKey,
    });
    if (user?.role !== UserRole.ADMIN && type === "create") {
      queryClient.invalidateQueries({
        queryKey: ApiQuery.users.getMe().queryKey,
      });
    }
    router.push("/dashboard");
  };

  const handleSubmit = form.handleSubmit((data: CreateShopDTO) => {
    if (shop?.id) {
      updateShop(
        { id: shop.id, ...data },
        {
          onSuccess: () => {
            callbackSuccess("update");
          },
        }
      );
    } else {
      createShop(
        { ...data },
        {
          onSuccess: () => {
            callbackSuccess("create");
          },
        }
      );
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mb-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your shop name" {...field} />
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
                  <Input placeholder="Your shop address" {...field} />
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
    </Form>
  );
};

export default ShopForm;
