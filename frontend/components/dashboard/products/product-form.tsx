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
import { RequestProductDTO, ResponseProductDTO } from "@/types/Api";
import { ToastTitle } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxCategories } from "../combobox/category";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, XIcon } from "lucide-react";
import { ComboboxSuppliers } from "../combobox/supplier";
import InputCurrency from "@/components/input-currency";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/mutations/user";

const schema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().optional(),
  salePrice: z.coerce
    .number()
    .min(0, { message: "Sale price must be positive" })
    .optional(),
  wholesalePrice: z.coerce
    .number()
    .min(0, { message: "Wholesale price must be positive" })
    .optional(),
  unit: z.enum(["KG", "BAG"]).optional(),
  imageUrls: z
    .array(
      z.object({ url: z.string().url({ message: "Must be a valid URL" }) })
    )
    .default([]),
  categoryId: z.string().nullable().optional(),
  supplierId: z.string().nullable().optional(),
  shopId: z.coerce.number(),
});

type ProductFormDTO = z.infer<typeof schema>;

type Props = {
  onClose?: () => void;
  product?: ResponseProductDTO;
};

const ProductForm = ({ onClose, product }: Props) => {
  const { data: currentUser } = useMe();

  const form = useForm<ProductFormDTO>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          ...product,
          categoryId: product.category?.id?.toString(),
          supplierId: product.supplier?.id?.toString(),
          imageUrls: product.imageUrls?.map((url) => ({ url })) || [],
        }
      : {
          name: "",
          description: "",
          salePrice: 0,
          wholesalePrice: 0,
          unit: "KG",
          imageUrls: [],
          shopId: 1,
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
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const router = useRouter();

  const isPending = isCreating || isUpdating;
  const { reset } = form;

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        categoryId: product.category?.id?.toString(),
        supplierId: product.supplier?.id?.toString(),
        imageUrls: product.imageUrls?.map((url) => ({ url })) || [],
      });
    }
  }, [product, reset]);

  const factoryMutateConfig = (type: "create" | "update") => {
    return {
      onSuccess: () => {
        toast({
          title: ToastTitle.success,
          description: `Product ${type === "create" ? "created" : "updated"} successfully.`,
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

  const onSubmit = form.handleSubmit((data) => {
    if (currentUser?.shopId) {
      const payload = {
        ...data,
        categoryId: data.categoryId ? Number(data.categoryId) : undefined,
        supplierId: data.supplierId ? Number(data.supplierId) : undefined,
      };

      const mutateData: RequestProductDTO = {
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

  const className = `
        appearance-none
        [moz-appearance:textfield]
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
    `;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="mb-12">
        <div className="flex flex-col gap-3 mb-4">
          {/* Other form fields (Name, Description, etc.) */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-2">
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Sale Price (VND)</FormLabel>
                  <FormControl>
                    <InputCurrency
                      className={className}
                      placeholder="Sale Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wholesalePrice"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Wholesale Price (VND)</FormLabel>
                  <FormControl>
                    <InputCurrency
                      className={className}
                      placeholder="Wholesale Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Supplier</FormLabel>
                <br />
                <FormControl>
                  <ComboboxSuppliers
                    onSelect={field.onChange}
                    formValue={field.value?.toString()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-2">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
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
            <div className="flex-1">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="KG">Kg</SelectItem>
                            <SelectItem value="BAG">Bag</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormItem className="w-full">
            <FormLabel>Image URLs</FormLabel>
            <div className="flex flex-col gap-2">
              {imageFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`imageUrls.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Paste image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <XIcon />
                  </Button>
                </div>
              ))}
              {imageFields.length < 5 && (
                <Button variant="outline" onClick={() => append({ url: "" })}>
                  <Plus className="h-4 w-4" />
                  Add Image URL
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isPending} className="mt-2">
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProductForm;
