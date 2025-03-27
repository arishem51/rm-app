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
import { useCreateProduct, useUpdateProduct } from "@/hooks/mutations/product";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { InventoryResponseDTO, ProductRequestDTO, ZoneDTO } from "@/types/Api";
import { appearanceNone, ToastTitle, UserRole } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxCategories } from "../combobox/category";
import { Plus, XIcon } from "lucide-react";
import { ComboboxPartners } from "../combobox/partner";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/mutations/user";
import { cn } from "@/lib/utils";
import InputCurrency from "@/components/input-currency";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllZonesByShop } from "@/services/hooks/warehouses";

const schema = z.object({
  name: z.string().nonempty({ message: "Tên là bắt buộc" }),
  description: z.string().optional(),
  imageUrls: z
    .array(z.object({ url: z.string().url({ message: "URL phải hợp lệ" }) }))
    .default([]),
  categoryId: z.string().nullable().optional(),
  partnerId: z.string().nullable().optional(),
  shopId: z.coerce.number(),
  quantity: z.coerce.number({ message: "Số không hợp lệ" }),
  warehouseId: z.coerce.number({ message: "Kho là bắt buộc" }),
  zoneId: z.coerce.number({ message: "Kho là bắt buộc" }),
  price: z.coerce.number({ message: "Giá không hợp lệ" }),
});

type ProductFormDTO = z.infer<typeof schema>;

type Props = {
  onClose?: () => void;
  product?: InventoryResponseDTO;
};

const ProductForm = ({ onClose, product: inventory }: Props) => {
  const { product } = inventory ?? {};
  const { data: currentUser } = useMe();

  const form = useForm<ProductFormDTO>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          ...product,
          quantity: inventory?.quantity,
          categoryId: product.category?.id?.toString(),
          partnerId: product.supplier?.id?.toString(),
          imageUrls: product.imageUrls?.map((url) => ({ url })) || [],
          warehouseId: inventory?.warehouseId,
          shopId: product.shop!.id!,
          zoneId: inventory?.zoneId,
        }
      : {
          name: "",
          description: "",
          imageUrls: [],
          shopId: currentUser!.shopId!,
          quantity: 0,
        },
  });
  const {
    fields: imageFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "imageUrls",
  });
  const queryClient = useQueryClient();
  console.log(form.formState.errors);

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const router = useRouter();

  const isPending = isCreating || isUpdating;
  const { reset } = form;
  const isOwner = currentUser?.role === UserRole.OWNER;

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        categoryId: product.category?.id?.toString(),
        partnerId: product.supplier?.id?.toString(),
        imageUrls: product.imageUrls?.map((url) => ({ url })) || [],
        warehouseId: inventory?.warehouseId,
        shopId: product.shop!.id!,
      });
    }
  }, [inventory?.warehouseId, product, reset]);

  const { data = {} } = useAllZonesByShop();
  const { data: zones = [] } = data;

  const factoryMutateConfig = (type: "create" | "update") => {
    return {
      onSuccess: () => {
        toast({
          title: ToastTitle.success,
          description: `Sản phẩm được ${type === "create" ? "tạo" : "sửa"} thành công.`,
        });
        queryClient.invalidateQueries({
          queryKey: ApiQuery.products.getProducts().queryKey,
        });
        onClose?.();
        router.push("/dashboard/products");
      },
      onError: (error: Error) => {
        toast({
          title: ToastTitle.error,
          description: error.message,
        });
      },
    };
  };

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

  const onSubmit = form.handleSubmit((data) => {
    if (currentUser?.shopId) {
      const payload = {
        ...data,
        categoryId: data.categoryId ? Number(data.categoryId) : undefined,
        partnerId: data.partnerId ? Number(data.partnerId) : undefined,
      };

      const mutateData: ProductRequestDTO = {
        ...payload,
        imageUrls: payload.imageUrls.map((image) => image.url),
        shopId: currentUser?.shopId,
      };
      if (product?.id) {
        updateProduct(
          { id: product.id, ...mutateData },
          factoryMutateConfig("update")
        );
      } else {
        createProduct(mutateData, factoryMutateConfig("create"));
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="mb-12">
        <FormField
          control={form.control}
          name="shopId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="warehouseId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3 mb-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Tên" readOnly={!isOwner} {...field} />
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
                    readOnly={!isOwner}
                    rows={3}
                    placeholder="Mô tả sản phẩm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <InputCurrency
                label="Giá"
                name="price"
                placeholder="Ví dụ: 15000"
              />
            </div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Số lượng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Số lượng"
                      className={appearanceNone}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="zoneId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kho</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(zoneId) => {
                          field.onChange(zoneId);
                          const warehouseId = zones.find(
                            (item) => item.id === Number(zoneId)
                          )?.warehouseId;
                          if (warehouseId) {
                            form.setValue("warehouseId", warehouseId);
                          }
                        }}
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
                                        value={id}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="partnerId"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "w-full",
                      isOwner ? "" : "pointer-events-none"
                    )}
                  >
                    <FormLabel>Nhà cung cấp</FormLabel>
                    <br />
                    <FormControl>
                      <ComboboxPartners
                        onSelect={field.onChange}
                        formValue={field.value?.toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "w-full",
                      isOwner ? "" : "pointer-events-none"
                    )}
                  >
                    <FormLabel>Danh mục</FormLabel>
                    <br />
                    <FormControl>
                      <ComboboxCategories
                        onSelect={field.onChange}
                        formValue={field.value?.toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormItem className="w-full">
            <FormLabel>URLs Ảnh</FormLabel>
            <div className="flex flex-col gap-2">
              {imageFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`imageUrls.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            readOnly={!isOwner}
                            placeholder="Vui lòng nhập URL ảnh"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={!isOwner}
                    onClick={() => remove(index)}
                  >
                    <XIcon />
                  </Button>
                </div>
              ))}
              {imageFields.length < 5 && isOwner && (
                <Button variant="outline" onClick={() => append({ url: "" })}>
                  <Plus className="h-4 w-4" />
                  Thêm URL Ảnh
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        </div>
        {isOwner && (
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="mt-2">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
};

export default ProductForm;
