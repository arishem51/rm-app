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
import { WarehouseCreateDTO, WarehouseDTO } from "@/types/Api";
import {
  useCreateWarehouse,
  useUpdateWarehouse,
} from "@/hooks/mutations/warehouse";
import { useMe } from "@/hooks/mutations/user";

type Props = {
  onClose?: () => void;
  warehouse?: WarehouseDTO;
};

const schemaFields = {
  name: z.string().nonempty({ message: "Tên là bắt buộc" }),
  address: z.string().nonempty({ message: "Địa chỉ là bắt buộc" }),
};

const FacilityForm = ({ warehouse, onClose }: Props) => {
  const form = useForm<WarehouseCreateDTO>({
    defaultValues: {
      name: "",
      address: "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });

  const { mutate: createFacility, isPending: isCreating } =
    useCreateWarehouse();
  const { mutate: updateFacility, isPending: isUpdating } =
    useUpdateWarehouse();
  const queryClient = useQueryClient();
  const { data: currentUser } = useMe();

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      title: ToastTitle.success,
      description: `${type === "create" ? "Tạo" : "Sửa"} kho thành công`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.warehouses.getWarehouses().queryKey,
    });
  };

  const callbackFailed = (type: "create" | "update") => {
    toast({
      title: ToastTitle.error,
      description: `${type === "create" ? "Tạo" : "Sửa"} kho thất bại`,
    });
    onClose?.();
  };

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (warehouse) {
      form.reset(warehouse);
    }
  }, [form, warehouse]);

  const handleSubmit = form.handleSubmit((data: WarehouseCreateDTO) => {
    if (warehouse?.id) {
      updateFacility(
        { warehouseId: warehouse.id, ...data },
        {
          onSuccess: () => {
            callbackSuccess("update");
          },
          onError: () => {
            callbackFailed("update");
          },
        }
      );
    } else if (currentUser?.shopId) {
      createFacility(
        {
          ...data,
          shopId: currentUser.shopId,
        },
        {
          onSuccess: () => {
            callbackSuccess("create");
          },
          onError: () => {
            callbackFailed("create");
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
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Tên kho" {...field} />
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
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Địa chỉ kho" {...field} />
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

export default FacilityForm;
