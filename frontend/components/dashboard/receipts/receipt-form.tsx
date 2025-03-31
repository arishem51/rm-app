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
import { appearanceNone, ToastTitle } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { useRouter } from "next/navigation";
import EmptyState from "../empty-state";
import { format } from "date-fns";
import { cn, toCurrency } from "@/lib/utils";
import { uniqBy } from "lodash";
import PackagingTooltip from "../inventories/packaging-tooltip";
import ZoneTooltip from "../inventories/zone-tooltip";

const schema = z.object({
  receiptCode: z.string().optional(),
  createdBy: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.coerce.number(),
        quantity: z.coerce.number().min(1, { message: "Không hợp lệ" }),
        zoneId: z.coerce.number(),
        price: z.coerce.number(),
        packageValue: z.coerce.number().min(1, { message: "Không hợp lệ" }),
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

  const isCreateReceipt = !receipt;
  const { reset, watch } = form;
  const receiptItems = watch("items");
  const selectedZones = uniqBy(receiptItems, "zoneId").map(
    (item) => item.zoneId
  );
  const filterZoneBySelect = (zone: ZoneDTO, currentSelectZoneId: number) =>
    currentSelectZoneId === zone.id || !selectedZones.includes(zone.id!);

  useEffect(() => {
    if (receipt) {
      reset({
        receiptCode: generateReceiptCode(receipt),
        createdBy: receipt.createdBy?.name,
        items: receipt.receiptItems?.map((item) => ({
          ...item,
          price: item.productPrice,
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

  const renderZone = (zoneId: number) => {
    const zone = zones.find((zone) => zone.id === zoneId);
    if (!zone) {
      return "";
    }
    return `${zone.name}/${zone.warehouseName}`;
  };

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
                    const product = products[0];
                    const zonesSet = new Set(zones.map((zone) => zone.id!));
                    const selectedZonesSet = new Set(selectedZones);
                    const different = zonesSet.difference(selectedZonesSet);
                    const zoneId = different.values().next().value;
                    if (product && zoneId) {
                      append({
                        productId: product.id!,
                        quantity: 1,
                        zoneId,
                        price: product.price ?? 0,
                        packageValue: 5,
                      });
                    } else {
                      toast({
                        title: !product
                          ? "Bạn chưa có sản phẩm nào"
                          : "Bạn chưa có khu vực hoặc khu vực đã được chọn hết",
                        description: !product
                          ? "Vui lòng thêm sản phẩm trước khi tạo phiếu nhập."
                          : "Vui lòng thêm khu vực.",
                      });
                    }
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
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Số lượng bao</TableHead>
                    <TableHead>
                      <PackagingTooltip />
                    </TableHead>
                    <TableHead>
                      <ZoneTooltip />
                    </TableHead>
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
                      <TableCell className="align-top">
                        <FormField
                          control={form.control}
                          name={`items.${index}.productId`}
                          render={({ field }) => (
                            <FormControl>
                              {isCreateReceipt ? (
                                <ComboboxProducts
                                  onSelect={field.onChange}
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
                      <TableCell className="align-middle">
                        <FormField
                          control={form.control}
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <FormControl>
                              <span>{toCurrency(field.value)}</span>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <>
                              <FormControl>
                                {isCreateReceipt ? (
                                  <Input
                                    {...field}
                                    className={cn("w-[86px]", appearanceNone)}
                                    type="number"
                                    placeholder="Ví dụ: 10"
                                  />
                                ) : (
                                  <span>{field.value}</span>
                                )}
                              </FormControl>
                              <FormMessage className="whitespace-nowrap" />
                            </>
                          )}
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <FormField
                          control={form.control}
                          name={`items.${index}.packageValue`}
                          render={({ field }) => (
                            <>
                              <FormControl>
                                {isCreateReceipt ? (
                                  <Input
                                    {...field}
                                    className={cn("w-[124px]", appearanceNone)}
                                    type="number"
                                    placeholder="Ví dụ: 10"
                                  />
                                ) : (
                                  <span>{field.value}</span>
                                )}
                              </FormControl>
                              <FormMessage className="whitespace-nowrap" />
                            </>
                          )}
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <FormField
                          control={form.control}
                          name={`items.${index}.zoneId`}
                          render={({ field }) => (
                            <FormControl>
                              {isCreateReceipt ? (
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(parseInt(value));
                                  }}
                                  value={field.value?.toString()}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn kho - khu trong kho" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(groupZoneByWarehouseId).map(
                                      ([key, value]) => {
                                        const filteredZones =
                                          value.zones.filter((zone) =>
                                            filterZoneBySelect(
                                              zone,
                                              field.value
                                            )
                                          ) ?? [];
                                        return (
                                          <SelectGroup key={key}>
                                            <SelectLabel>
                                              Tên Kho: {value.warehouseName}
                                            </SelectLabel>
                                            {filteredZones.length > 0 ? (
                                              filteredZones.map((zone) => {
                                                const id = zone.id!.toString();
                                                return (
                                                  <SelectItem
                                                    key={id}
                                                    value={id.toString()}
                                                    className="ml-2"
                                                  >
                                                    {zone.warehouseName} -{" "}
                                                    {zone.name}
                                                  </SelectItem>
                                                );
                                              })
                                            ) : (
                                              <span className="ml-3 text-xs text-gray-600">
                                                Kho hàng này không còn khu vực
                                                nào khả dụng
                                              </span>
                                            )}
                                          </SelectGroup>
                                        );
                                      }
                                    )}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span>{renderZone(field.value)}</span>
                              )}
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      {isCreateReceipt && (
                        <TableCell className="align-top text-right">
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
