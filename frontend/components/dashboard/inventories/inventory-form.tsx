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
import { InventoryUpdateDTO, InventoryResponseDTO } from "@/types/Api";
import { useUpdateInventory } from "@/hooks/mutations/inventory";
import { ComboboxProducts } from "../combobox/product";
import { useRouter } from "next/navigation";
import PackagingTooltip from "./packaging-tooltip";
import SelectAvailableZones from "../select-available-zones";
import { useAllZonesByShop } from "@/services/hooks/warehouses";

type Props = {
  onClose?: () => void;
  inventory?: InventoryResponseDTO;
};

const schemaFields = z.object({
  productId: z.coerce.number(),
  warehouseId: z.coerce.number(),
  zoneId: z.coerce.number(),
  quantity: z.coerce.number(),
  packageValue: z.coerce.number(),
});

const InventoryForm = ({ inventory, onClose }: Props) => {
  const form = useForm<z.infer<typeof schemaFields>>({
    defaultValues: {
      productId: inventory!.product!.id!,
      warehouseId: inventory?.warehouseId,
      zoneId: inventory?.zoneId,
      quantity: inventory?.quantity,
      packageValue: inventory?.packageValue,
    },
    resolver: zodResolver(schemaFields),
  });

  const { mutate: updateInventory, isPending: isUpdating } =
    useUpdateInventory();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: zoneQuery = {} } = useAllZonesByShop();
  const { data: zones = [] } = zoneQuery;

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      title: ToastTitle.success,
      description: `${type === "create" ? "Tạo" : "Cập nhật"} kho hàng thành công!`,
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
      description: `${type === "create" ? "Tạo" : "Cập nhật"} kho hàng thất bại!`,
    });
    onClose?.();
  };

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
    } else {
      //   createInventory(data, {
      //     onSuccess: () => {
      //       callbackSuccess("create");
      //     },
      //     onError: () => {
      //       callbackFailed("create");
      //     },
      //   });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem className="col-span-2">
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
            name="zoneId"
            render={({ field: formField }) => (
              <FormItem className="col-span-2">
                <FormLabel>Khu vực</FormLabel>
                <FormControl>
                  <SelectAvailableZones
                    zones={zones}
                    onChange={formField.onChange}
                    value={formField.value}
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
                  <Input type="number" placeholder="Ví dụ: 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="packageValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <PackagingTooltip />
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ví dụ: 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-2 col-span-2">
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
