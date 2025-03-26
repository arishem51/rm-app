"use client";

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
import { Button } from "@/components/ui/button";
import { appearanceNone, ToastTitle } from "@/lib/constants";
import { useCreateOrder } from "@/hooks/mutations/order";
import { toast } from "@/hooks/use-toast";
import { CreateOrderDTO, OrderResponseDTO } from "@/types/Api";
import { DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "../empty-state";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { toCurrency, cn } from "@/lib/utils";
import { ComboboxInventories } from "../combobox/inventories";
import { useAllInventories } from "@/services/hooks/inventories";
import { CircleHelp, Plus, XIcon } from "lucide-react";
import { uniqBy } from "lodash";
import { ComboboxPartners } from "../combobox/partner";
import { useAllPartners } from "@/services/hooks/partners";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import InputCurrency from "@/components/input-currency";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { ApiQuery } from "@/services/query";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  onClose?: () => void;
  order?: OrderResponseDTO;
};

const OrderForm = ({ onClose, order }: Props) => {
  const [isSelectPartner, setIsSelectPartner] = useState(false);
  const { data: { data: allInventories = [] } = {} } = useAllInventories();
  const { data: { data: allPartners = [] } = {} } = useAllPartners();
  const router = useRouter();
  const queryClient = useQueryClient();

  const schema = z.object({
    partnerId: z.number().nullable().optional(),
    partnerName: z.string().min(1, "Tên khách hàng là bắt buộc"),
    partnerPhone: z
      .string()
      .regex(/^[0-9]{10,12}$/, "Số điện thoại không hợp lệ"),
    amount: z.number().min(0, "Giá bán là bắt buộc"),
    orderItems: z
      .array(
        z
          .object({
            inventoryId: z.coerce.number(),
            zoneId: z.coerce.number(),
            productId: z.coerce.number(),
            productPrice: z.coerce.number(),
            productName: z.string().nonempty("Bắt buộc"),
            quantity: z.coerce.number().min(1, "Bắt buộc"),
          })
          .refine(
            (data) => {
              const { productId, quantity } = data;
              const maximumQuantity = allInventories.find(
                (item) => item.product?.id === productId
              )?.quantity;
              if (maximumQuantity && quantity > maximumQuantity) {
                return false;
              }
              return true;
            },
            {
              message: "Lớn hơn số lượng tồn kho",
              path: ["quantity"],
            }
          )
      )
      .min(1, "Phải có ít nhất một sản phẩm"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: order
      ? {
          ...order,
          orderItems: [],
        }
      : {
          partnerName: "",
          partnerPhone: "",
          amount: 0,
          orderItems: [],
        },
  });
  const {
    fields: orderItems,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });
  const orderItemsWatch = form.watch("orderItems");
  const selectedInventories = uniqBy(orderItemsWatch, "inventoryId").map(
    (item) => +item.inventoryId
  );
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();

  const isPending = isCreating;

  const onSubmit = form.handleSubmit((data) => {
    const mutateData: CreateOrderDTO = {
      ...data,
      orderItems: data.orderItems.map((item) => ({
        inventoryId: Number(item.inventoryId),
        zoneId: Number(item.zoneId),
        productId: Number(item.productId),
        productPrice: item.productPrice,
        productName: item.productName,
        quantity: item.quantity,
      })),
      partnerId: Number(data?.partnerId) || undefined,
    };

    createOrder(mutateData, {
      onSuccess: () => {
        toast({
          title: ToastTitle.success,
          description: `Tạo đơn hàng thành công`,
        });
        queryClient.invalidateQueries({
          queryKey: ApiQuery.orders.getOrders().queryKey,
        });
        router.push("/dashboard/orders");
        onClose?.();
      },
      onError: (error: Error) => {
        toast({
          title: ToastTitle.error,
          description: error.message,
        });
      },
    });
  });

  const isCreateOrder = true;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">Danh sách sản phẩm</span>
            <Button
              variant="outline"
              className="mt-3"
              type="button"
              onClick={() => {
                const inventorySet = new Set(
                  allInventories.map((item) => item.id!)
                );
                const selectedInventorySet = new Set(selectedInventories);
                const different = inventorySet.difference(selectedInventorySet);
                const inventoryId = different.values().next().value;
                const inventory = allInventories.find(
                  (item) => item.id === inventoryId
                );
                if (inventoryId) {
                  append({
                    inventoryId: inventoryId,
                    quantity: 1,
                    productId: inventory!.product!.id!,
                    productName: inventory!.product!.name!,
                    productPrice: +inventory!.product!.price!,
                    zoneId: inventory!.zoneId!,
                  });
                } else {
                  toast({
                    title: "Không có hàng hoặc hàng đã được chọn hết",
                    description: "Vui lòng nhập thêm hàng mới vào trong kho",
                  });
                }
              }}
            >
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between gap-2">
                <div className="flex-1">
                  {orderItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>STT</TableHead>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead>Giá nhập</TableHead>
                          <TableHead>Số lượng/Tồn kho</TableHead>
                          <TableHead>Khu vực</TableHead>
                          <TableHead>Giá tiền</TableHead>
                          {isCreateOrder && (
                            <TableHead className="text-right">
                              Hành động
                            </TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((orderItem, index) => {
                          const itemChg = orderItemsWatch[index];
                          const currentInventory = allInventories.find(
                            (item) => item.id === +itemChg?.inventoryId
                          );
                          return (
                            <TableRow key={orderItem.id}>
                              <TableCell>
                                <span>{index + 1}</span>
                              </TableCell>
                              <TableCell className="align-top">
                                <FormField
                                  control={form.control}
                                  name={`orderItems.${index}.inventoryId`}
                                  render={({ field }) => (
                                    <FormControl>
                                      {isCreateOrder ? (
                                        <ComboboxInventories
                                          onSelect={(value) =>
                                            field.onChange(value ? value : null)
                                          }
                                          formValue={field.value?.toString()}
                                        />
                                      ) : (
                                        <span>
                                          {
                                            allInventories.find(
                                              (item) =>
                                                item.product?.id ===
                                                +field.value
                                            )?.product?.name
                                          }
                                        </span>
                                      )}
                                    </FormControl>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                {isCreateOrder ? (
                                  <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                                    {toCurrency(
                                      +(currentInventory?.product?.price ?? 0)
                                    )}
                                  </div>
                                ) : (
                                  <FormField
                                    control={form.control}
                                    name={`orderItems.${index}.productPrice`}
                                    render={({ field }) => (
                                      <FormControl>
                                        <span>{toCurrency(field.value)}</span>
                                      </FormControl>
                                    )}
                                  />
                                )}
                              </TableCell>
                              <TableCell className="align-top">
                                <FormField
                                  control={form.control}
                                  name={`orderItems.${index}.quantity`}
                                  render={({ field }) => (
                                    <>
                                      <FormControl>
                                        {isCreateOrder ? (
                                          <div className="flex items-center whitespace-nowrap flex-nowrap gap-2">
                                            <Input
                                              {...field}
                                              onChange={(e) =>
                                                field.onChange(e.target.value)
                                              }
                                              className={cn(
                                                "w-[68px]",
                                                appearanceNone
                                              )}
                                              type="number"
                                              placeholder="Ví dụ: 10"
                                            />
                                            {" / "}
                                            {currentInventory?.quantity ?? 0}
                                          </div>
                                        ) : (
                                          <span>{field.value}</span>
                                        )}
                                      </FormControl>
                                      <FormMessage className="whitespace-nowrap" />
                                    </>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                {isCreateOrder ? (
                                  <span>
                                    {currentInventory
                                      ? `${currentInventory?.warehouseName} - ${currentInventory?.zoneName}`
                                      : "--/--"}
                                  </span>
                                ) : (
                                  <span>Test</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {toCurrency(
                                  (itemChg?.quantity ?? 0) *
                                    +(itemChg.productPrice ?? 0)
                                )}
                              </TableCell>
                              {isCreateOrder && (
                                <TableCell className="align-top text-right">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    disabled={!isCreateOrder}
                                    onClick={() => remove(index)}
                                  >
                                    <XIcon />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
              <div>
                <Separator className="my-2 mb-4" />
                <div>
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      className="inline-flex items-center gap-1"
                    >
                      <div>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-6 h-6 border-none"
                        >
                          <CircleHelp />
                        </Button>
                        <span>Tổng tiền gốc: </span>
                        <span className="text-sm">
                          {toCurrency(
                            orderItemsWatch.length > 0
                              ? orderItemsWatch.reduce((acc, prev) => {
                                  return (acc +=
                                    (prev.productPrice ?? 0) *
                                    (prev.quantity ?? 0));
                                }, 0)
                              : 0
                          )}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        Tổng tiền gốc của đơn hàng, được tính từ số lượng và giá
                        nhập của sản phẩm.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="mt-2 flex gap-2 items-center">
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      className="inline-flex items-center gap-1"
                    >
                      <div>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-6 h-6 border-none"
                        >
                          <CircleHelp />
                        </Button>
                        <span>Tổng tiền thực bán: </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        Tổng tiền thực bán của đơn hàng, được nhập khi tạo đơn
                        hàng
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <InputCurrency
                    name="amount"
                    className={appearanceNone}
                    placeholder="Ví dụ: 10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <span className="text-2xl font-bold">Khách hàng</span>
          <Card className="mt-2">
            <CardContent className="pt-6">
              <div className="mb-2">
                <FormItem>
                  <FormLabel>Chọn khách hàng</FormLabel>
                  <ComboboxPartners
                    onSelect={(id) => {
                      const partner = allPartners.find(
                        (item) => item.id === +id
                      );
                      if (partner) {
                        form.setValue("partnerName", partner.name!);
                        form.setValue("partnerPhone", partner.phone!);
                        form.setValue("partnerId", partner.id!);
                        setIsSelectPartner(true);
                      } else {
                        form.setValue("partnerId", undefined);
                        setIsSelectPartner(false);
                      }
                    }}
                  />
                </FormItem>
              </div>
              <div className="flex items-center gap-3">
                <FormField
                  control={form.control}
                  name="partnerName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tên khách hàng</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ví dụ: Duy"
                          {...field}
                          readOnly={isSelectPartner}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="partnerPhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ví dụ: 0123837534"
                          {...field}
                          readOnly={isSelectPartner}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Đang tạo..." : "Tạo đơn hàng"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default OrderForm;
