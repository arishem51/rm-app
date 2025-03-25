import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { WarehouseDTO, ZoneDTO, ZoneRequestDTO } from "@/types/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useCreateZone, useUpdateZone } from "@/hooks/mutations/zone";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { ToastTitle } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onClose?: () => void;
  zone?: ZoneDTO;
  warehouse: WarehouseDTO;
};

const schemaFields = {
  name: z.string().nonempty({ message: "Tên là bắt buộc" }),
  warehouseId: z.coerce.number().min(1, { message: "Kho là bắt buộc" }),
  description: z.string().optional(),
};

const ZoneForm = ({ zone, onClose, warehouse }: Props) => {
  const warehouseId = warehouse.id!;
  const form = useForm<ZoneRequestDTO>({
    defaultValues: {
      name: zone?.name || "",
      warehouseId: warehouseId,
      description: zone?.description || "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });

  const { mutate: createZone, isPending: isCreating } = useCreateZone();
  const { mutate: updateZone, isPending: isUpdating } = useUpdateZone();

  const queryClient = useQueryClient();

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      title: ToastTitle.success,
      description: `${type === "create" ? "Tạo" : "Sửa"} khu vực thành công`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.zones.getAllByWarehouse(warehouseId).queryKey,
    });
  };

  const callbackFailed = (type: "create" | "update") => {
    toast({
      title: ToastTitle.error,
      description: `${type === "create" ? "Tạo" : "Sửa"} khu vực thất bại`,
    });
    onClose?.();
  };

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (zone) {
      form.reset({
        name: zone.name,
        warehouseId: zone.warehouseId,
      });
    }
  }, [form, zone]);

  const handleSubmit = form.handleSubmit((data: ZoneRequestDTO) => {
    if (zone?.id) {
      updateZone(
        { id: zone.id, ...data },
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
      createZone(data, {
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Bên trái kho" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Ví dụ: Khu chứa gạo nếp"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warehouseId"
            render={() => (
              <FormItem>
                <FormControl>
                  <FormControl>
                    <Input readOnly value={warehouse.name} type="hidden" />
                  </FormControl>
                </FormControl>
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

export default ZoneForm;
