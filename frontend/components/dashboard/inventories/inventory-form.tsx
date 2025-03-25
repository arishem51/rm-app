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
import { InventoryUpdateDTO, InventoryResponseDTO, ZoneDTO } from "@/types/Api";
import { useUpdateInventory } from "@/hooks/mutations/inventory";
import { ComboboxProducts } from "../combobox/product";
import { useRouter } from "next/navigation";

import { useAllZonesByShop } from "@/services/hooks/warehouses";

type Props = {
  onClose?: () => void;
  inventory?: InventoryResponseDTO;
};

const schemaFields = {
  productId: z.coerce.number({ message: "Sản phẩm là bắt buộc" }),
  warehouseId: z.coerce.number({ message: "Kho là bắt buộc" }),
  quantity: z.coerce.number({ message: "Số không hợp lệ" }),
};

const InventoryForm = ({ inventory, onClose }: Props) => {
  const form = useForm<InventoryUpdateDTO>({
    defaultValues: {
      productId: inventory?.productId,
      zoneId: inventory?.zoneId,
    },
    resolver: zodResolver(z.object(schemaFields)),
  });

  const { mutate: updateInventory, isPending: isUpdating } =
    useUpdateInventory();
  const queryClient = useQueryClient();
  const router = useRouter();

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      title: ToastTitle.success,
      description: `${type === "create" ? "Tạo" : "Sửa"} hàng thành công`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.inventories.getInventories().queryKey,
    });
    router.push("/dashboard/warehouses/inventories");
  };

  const callbackFailed = (type: "create" | "update") => {
    toast({
      title: ToastTitle.error,
      description: `${type === "create" ? "Tạo" : "Sửa"} hàng thất bại`,
    });
    onClose?.();
  };

  const { data = {} } = useAllZonesByShop();
  const { data: zones = [] } = data;

  const isPending = isUpdating;

  useEffect(() => {
    if (inventory) {
      form.reset(inventory);
    }
  }, [form, inventory]);

  const handleSubmit = form.handleSubmit((data: InventoryUpdateDTO) => {
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
                <FormLabel>Sản phẩm</FormLabel>
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
                <FormLabel>Số lượng</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Số lượng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={isPending}>
              Lưu
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
};

export default InventoryForm;
