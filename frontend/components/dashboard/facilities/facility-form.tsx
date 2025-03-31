import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { ActionStatus, ToastTitle } from "@/lib/constants";
import { WarehouseDTO, WarehouseUpdateDTO, ZoneDTO } from "@/types/Api";
import {
  useCreateWarehouse,
  useUpdateWarehouse,
} from "@/hooks/mutations/warehouse";
import { useMe } from "@/hooks/mutations/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, CheckCircle2, Edit, X, XIcon } from "lucide-react";
import EmptyState from "../empty-state";
import ZoneForm from "./zones/zone-form";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onClose?: () => void;
  warehouse?: WarehouseDTO;
  zones?: ZoneDTO[];
  detailsForm?: boolean;
};

const schemaFields = {
  name: z.string().nonempty({ message: "Tên là bắt buộc" }),
  address: z.string().nonempty({ message: "Địa chỉ là bắt buộc" }),
  status: z.enum([ActionStatus.ACTIVE, ActionStatus.INACTIVE]),
  description: z.string().optional(),
};

const FacilityForm = ({
  warehouse,
  onClose,
  zones,
  detailsForm = false,
}: Props) => {
  const form = useForm<WarehouseUpdateDTO & { zones?: number[] }>({
    defaultValues: {
      name: "",
      address: "",
      description: "",
      status: ActionStatus.ACTIVE,
    },
    resolver: zodResolver(z.object(schemaFields)),
  });

  const { mutate: createFacility, isPending: isCreating } =
    useCreateWarehouse();
  const { mutate: updateFacility, isPending: isUpdating } =
    useUpdateWarehouse();
  const queryClient = useQueryClient();
  const { data: currentUser } = useMe();
  const [zone, setZone] = useState<ZoneDTO>();
  const router = useRouter();

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      title: ToastTitle.success,
      description: `${type === "create" ? "Tạo" : "Sửa"} kho thành công`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.warehouses.getWarehouses().queryKey,
    });
    router.push("/dashboard/warehouses/facilities");
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
  }, [form, warehouse, zones]);

  const handleSubmit = form.handleSubmit((data: WarehouseUpdateDTO) => {
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
      {warehouse && (
        <Dialog
          open={!!zone}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setZone(undefined);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {zone?.id ? "Cập nhật" : "Tạo"} khu vực trong kho
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin khu vực. Nhấn lưu khi hoàn thành.
              </DialogDescription>
            </DialogHeader>
            <ZoneForm
              onClose={() => {
                setZone(undefined);
              }}
              zone={zone}
              warehouse={warehouse}
            />
          </DialogContent>
        </Dialog>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mb-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Ví dụ: Kho chuyên chứa gạo làm bánh, kẹo, dự trữ"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={isPending}>
              Lưu thông tin kho hàng
            </Button>
          </DialogFooter>
          {detailsForm && (
            <>
              <div className="mt-8 mb-2 flex items-center justify-between">
                <FormLabel className="text-lg">Khu vực trong kho</FormLabel>
                <Button
                  onClick={() => {
                    setZone({} as ZoneDTO);
                  }}
                  type="button"
                >
                  Thêm khu vực
                </Button>
              </div>
              {(zones ?? []).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STT</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Có tồn tại hàng tồn</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zones?.map((zone, index) => (
                      <TableRow key={zone.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{zone.name}</TableCell>
                        <TableCell>{zone.description}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                          >
                            {zone.inventoryId ? <Check /> : <X />}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => {
                              setZone(zone);
                            }}
                            size="icon"
                            variant="outline"
                            className="w-6 h-6"
                            type="button"
                          >
                            <Edit />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState />
              )}
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default FacilityForm;
