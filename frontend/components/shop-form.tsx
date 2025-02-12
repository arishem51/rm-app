import { useForm } from "react-hook-form";
import { CreateShopDTO } from "@/types/Api";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCreateShop } from "@/hooks/mutations/shop";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { useSetUserAtom } from "@/store/user";
import { apiClient } from "@/lib/utils";

const schemaFields = {
  name: z.string().nonempty({ message: "Name is required" }),
  address: z.string().nonempty({ message: "Address is required" }),
};

type Props = {
  onClose: () => void;
};

const ShopModal = ({ onClose }: Props) => {
  const form = useForm<CreateShopDTO>({
    defaultValues: {
      name: "",
      address: "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });
  const { mutate: createShop, isPending } = useCreateShop();
  const queryClient = useQueryClient();
  const setUser = useSetUserAtom();

  const handleSubmit = form.handleSubmit((data: CreateShopDTO) => {
    createShop(
      { ...data },
      {
        onSuccess: async () => {
          toast({
            variant: "default",
            title: "Success",
            description: "Create shop successfully",
          });
          onClose();
          queryClient.invalidateQueries({
            queryKey: ApiQuery.shops.getShops().queryKey,
          });
          //FIXME: should migrate to useQuery
          const user = await apiClient.getMe();
          if (user.data) {
            setUser({ user: user.data.data });
          }
        },
      }
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="mt-4">
        <DialogHeader>
          <DialogTitle>Create shop</DialogTitle>
          <DialogDescription>
            Click save changes when you&apos;are done to create your shop.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 my-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
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
    </Form>
  );
};

export default ShopModal;
