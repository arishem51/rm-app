import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { ToastTitle } from "@/lib/constants";
import { InventoryCreateDTO, InventoryResponseDTO } from "@/types/Api";
import {
  useCreateInventory,
  useUpdateInventory,
} from "@/hooks/mutations/inventory";
import { ComboboxProducts } from "../combobox/product";

type Props = {
  onClose?: () => void;
  inventory?: InventoryResponseDTO;
};

const schemaFields = {
  productId: z.number().min(1, { message: "Product is required" }),
  warehouseId: z.number().min(1, { message: "Warehouse is required" }),
  quantity: z.number().min(1, { message: "Quantity must be greater than 0" }),
};

const InventoryForm = ({ inventory, onClose }: Props) => {
  const form = useForm<InventoryCreateDTO>({
    resolver: zodResolver(z.object(schemaFields)),
  });

  const { mutate: createInventory, isPending: isCreating } =
    useCreateInventory();
  const { mutate: updateInventory, isPending: isUpdating } =
    useUpdateInventory();
  const queryClient = useQueryClient();

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      title: ToastTitle.success,
      description: `${type === "create" ? "Create" : "Update"} inventory successfully`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.inventories.getInventories().queryKey,
    });
  };

  const callbackFailed = (type: "create" | "update") => {
    toast({
      title: ToastTitle.error,
      description: `${type === "create" ? "Create" : "Update"} inventory failed!`,
    });
    onClose?.();
  };

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (inventory) {
      form.reset(inventory);
    }
  }, [form, inventory]);

  const handleSubmit = form.handleSubmit((data: InventoryCreateDTO) => {
    if (inventory?.id) {
      updateInventory(
        { id: inventory.id, ...data },
        {
          onSuccess: () => {
            callbackSuccess("update");
          },
          onError: () => {
            callbackFailed("update");
          },
        }
      );
    } else {
      createInventory(data, {
        onSuccess: () => {
          callbackSuccess("create");
        },
        onError: () => {
          callbackFailed("create");
        },
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mb-4">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <ComboboxProducts
                    onSelect={field.onChange}
                    formValue={field.value?.toString()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="warehouseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <FormControl>
                  <ComboboxProducts
                    onSelect={field.onChange}
                    formValue={field.value?.toString()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Quantity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
};

export default InventoryForm;
