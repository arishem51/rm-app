import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Category, CreateCategoryDTO } from "@/types/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/mutations/category";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { ToastTitle } from "@/lib/constants";

type Props = {
  onClose?: () => void;
  category?: Category;
};

const schemaFields = {
  name: z.string().nonempty({ message: "Tên là bắt buộc" }),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .max(500, "URL ảnh quá dài, tối đa 500 ký tự")
    .url("Sai định dạng URL")
    .optional(),
};

const CategoryForm = ({ category, onClose }: Props) => {
  const form = useForm<CreateCategoryDTO>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const queryClient = useQueryClient();

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      title: ToastTitle.success,
      description: `${type === "create" ? "Create" : "Update"} category successfully`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.categories.getCategories().queryKey,
    });
  };

  const callbackFailed = (type: "create" | "update") => {
    toast({
      title: ToastTitle.error,
      description: `${type === "create" ? "Create" : "Update"} category failed!`,
    });
    onClose?.();
  };

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl ?? "",
      });
    }
  }, [form, category]);

  const handleSubmit = form.handleSubmit((data: CreateCategoryDTO) => {
    if (category?.id) {
      updateCategory(
        { id: category.id, ...data },
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
      createCategory(data, {
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
                  <Input placeholder="Category name" {...field} />
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
                  <Input placeholder="Category description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh</FormLabel>
                <FormControl>
                  <Input placeholder="Ảnh danh mục" {...field} />
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

export default CategoryForm;
