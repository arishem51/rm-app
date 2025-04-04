"use client";

import { useEffect, useState } from "react";
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
import { ReceiptResponseDTO } from "@/types/Api";
import { ComboboxProducts } from "../combobox/product";
import { useAllZonesByShop } from "@/services/hooks/warehouses";
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
import Link from "next/link";
import ProductTooltip from "../products/product-tooltip";
import ConfirmSave from "@/components/confirm-save";
import SelectAvailableZones from "../select-available-zones";

const schema = z.object({
  receiptCode: z.string().optional(),
  createdBy: z.string().optional(),
  items: z
    .array(
      z.object({
        productName: z.string().optional(),
        warehouseName: z.string().optional(),
        zoneName: z.string().optional(),
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
  const [open, setOpen] = useState(false);
  const [dataSubmit, setDataSubmit] = useState<ReceiptFormDTO>();

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
  const { reset, watch } = form;
  const receiptItems = watch("items");
  const selectedZones = uniqBy(receiptItems, "zoneId").map(
    (item) => item.zoneId
  );

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
    setOpen(true);
    setDataSubmit(data);
  });

  return (
    <Form {...form}>
      <ConfirmSave
        onCancel={() => {
          setDataSubmit(undefined);
        }}
        onConfirm={() => {
          if (!dataSubmit) return;
          mutate(dataSubmit, {
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
        }}
        open={open}
        setOpen={setOpen}
      />
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
                        productName: product.name,
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
                    <TableHead>
                      <ProductTooltip />
                    </TableHead>
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
                          render={({ field: formField }) => (
                            <FormControl>
                              {isCreateReceipt ? (
                                <ComboboxProducts
                                  onSelect={(value) =>
                                    formField.onChange(+value)
                                  }
                                  formValue={formField.value?.toString()}
                                />
                              ) : (
                                <Link
                                  href={`/dashboard/products/${field.productId}`}
                                  className="hover:underline"
                                >
                                  <span>{field.productName}</span>
                                </Link>
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
                          render={({ field: formField }) => (
                            <FormControl>
                              {isCreateReceipt ? (
                                <SelectAvailableZones
                                  zones={zones}
                                  selectedZones={selectedZones}
                                  onChange={formField.onChange}
                                  value={formField.value}
                                />
                              ) : (
                                <span>
                                  {field.warehouseName} - {field.zoneName}
                                </span>
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
