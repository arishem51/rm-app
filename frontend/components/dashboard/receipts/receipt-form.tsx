"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Plus, XIcon } from "lucide-react";
import { useMe } from "@/hooks/mutations/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateReceiptCode } from "@/lib/helpers";
import { ReceiptResponseDTO, ZoneDTO } from "@/types/Api";
import { toCurrency } from "@/lib/utils";
import { ComboboxProducts } from "../combobox/product";
import { useAllZonesByShop } from "@/services/hooks/warehouses";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { useAllProducts } from "@/services/hooks/products";
import { useCreateReceipt } from "@/hooks/mutations/receipt";
import { ToastTitle } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { useRouter } from "next/navigation";
import EmptyState from "../empty-state";
import { format } from "date-fns";

const schema = z.object({
  receiptCode: z.string().optional(),
  createdBy: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.coerce.number(),
        productPrice: z.coerce.number().min(0),
        quantity: z.coerce.number().min(1),
        zoneId: z.coerce.number(),
      })
    )
    .min(1, "Vui lòng thêm ít nhất một sản phẩm."),
});

type ReceiptFormDTO = z.infer<typeof schema>;

type Props = {
  receipt?: ReceiptResponseDTO;
};

const ReceiptForm = ({ receipt }: Props) => {
  const { data: currentUser } = useMe();
  const form = useForm<ReceiptFormDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      createdBy: currentUser!.name.toString(),
      receiptCode: "",
      items: [],
    },
  });
  const { data: productQuery = {} } = useAllProducts();
  const { data: products = [] } = productQuery;
  const { data: zoneQuery = {} } = useAllZonesByShop();
  const { data: zones = [] } = zoneQuery;

  const groupZoneByWarehouseId = zones.reduce(
    (acc, zone) => {
      if (!acc[zone.warehouseId!]) {
        acc[zone.warehouseId!] = {
          warehouseId: zone.warehouseId!,
          warehouseName: zone.warehouseName,
          zones: [zone],
        };
      } else {
        acc[zone.warehouseId!].zones.push(zone);
      }
      return acc;
    },
    {} as Record<
      number,
      { warehouseId: number; warehouseName?: string; zones: ZoneDTO[] }
    >
  );

  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const { mutate, isPending } = useCreateReceipt();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isCreateReceipt = !receipt;
  const { reset } = form;

  useEffect(() => {
    if (receipt) {
      reset({
        receiptCode: generateReceiptCode(receipt),
        createdBy: receipt.createdBy?.name,
        items: receipt.receiptItems?.map((item) => ({
          productId: item.productId,
          productPrice: item.productPrice,
          quantity: item.quantity,
          zoneId: item.zoneId,
        })),
      });
    }
  }, [receipt, reset]);

  const onSubmit = form.handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: ToastTitle.success,
          description: `Phiếu nhập được tạo thành công.`,
        });
        queryClient.invalidateQueries({
          queryKey: ApiQuery.receipts.getReceipts().queryKey,
        });
        router.push("/dashboard/receipts");
      },
      onError: (error: Error) => {
        toast({
          title: ToastTitle.error,
          description: error.message,
        });
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="mb-12">
        <div className="flex flex-col gap-3 mb-4">
          {!isCreateReceipt && (
            <FormField
              control={form.control}
              name="receiptCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã phiếu</FormLabel>
                  <FormControl>
                    <Input placeholder="Mã phiếu" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex gap-2">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="createdBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người tạo</FormLabel>
                    <FormControl>
                      <Input placeholder="Người tạo" readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormItem>
                <FormLabel>Ngày tạo</FormLabel>
                <FormControl>
                  <Input readOnly value={format(new Date(), "yyyy-MM-dd")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          </div>
          <FormItem className="mt-3">
            <div className="flex justify-between items-center">
              <FormLabel>Danh sách sản phẩm</FormLabel>
              {isCreateReceipt && (
                <Button
                  variant="outline"
                  className="mt-3"
                  type="button"
                  onClick={() => {
                    append({
                      productId: products[0].id!,
                      productPrice: products[0].price!,
                      quantity: 1,
                      zoneId: zones[0].id!,
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Thêm sản phẩm
                </Button>
              )}
            </div>
            {itemFields.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Khu vực</TableHead>
                    {isCreateReceipt && (
                      <TableHead className="text-right">Hành động</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <span>{index + 1}</span>
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.productId`}
                          render={({ field }) => (
                            <FormControl>
                              {isCreateReceipt ? (
                                <ComboboxProducts
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    form.setValue(
                                      `items.${index}.productPrice`,
                                      products.find(
                                        (item) => item.id?.toString() === value
                                      )?.price ?? 0
                                    );
                                  }}
                                  formValue={field.value?.toString()}
                                />
                              ) : (
                                <span>
                                  {
                                    products.find(
                                      (item) => item.id === field.value
                                    )?.name
                                  }
                                </span>
                              )}
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.productPrice`}
                          render={({ field }) => (
                            <FormControl>
                              <span>{toCurrency(field.value)}</span>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormControl>
                              {isCreateReceipt ? (
                                <Input {...field} />
                              ) : (
                                <span>{field.value}</span>
                              )}
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.zoneId`}
                          render={({ field }) => (
                            <FormControl>
                              {isCreateReceipt ? (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value?.toString()}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn kho - khu trong kho" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(groupZoneByWarehouseId).map(
                                      ([key, value]) => {
                                        return (
                                          <SelectGroup key={key}>
                                            <SelectLabel>
                                              Tên Kho: {value.warehouseName}
                                            </SelectLabel>
                                            {value.zones.map((zone) => {
                                              const id = zone.id!.toString();
                                              return (
                                                <SelectItem
                                                  key={id}
                                                  value={id.toString()}
                                                  className="ml-2"
                                                >
                                                  {zone.name}
                                                </SelectItem>
                                              );
                                            })}
                                          </SelectGroup>
                                        );
                                      }
                                    )}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span>
                                  {
                                    zones.find(
                                      (item) => item.id === field.value
                                    )?.name
                                  }
                                </span>
                              )}
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      {isCreateReceipt && (
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={!isCreateReceipt}
                            onClick={() => remove(index)}
                          >
                            <XIcon />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState />
            )}
          </FormItem>
        </div>

        <DialogFooter>
          {isCreateReceipt && (
            <Button type="submit" disabled={isPending} className="mt-2">
              Tạo phiếu nhập
            </Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ReceiptForm;
