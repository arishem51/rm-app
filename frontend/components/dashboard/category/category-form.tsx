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
import { useCreateCategory } from "@/hooks/mutations/category";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";

type Props = {
  onClose?: () => void;
  category?: Category;
};

const schemaFields = {
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .max(500, "Image URL is too long (max 500 characters)")
    .url("Invalid URL format")
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
  const queryClient = useQueryClient();

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      title: "Success",
      description: `${type === "create" ? "Create" : "Update"} category successfully`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.categories.getCategories().queryKey,
    });
  };

  const isPending = isCreating;

  useEffect(() => {
    if (category) {
      form.reset(category);
    }
  }, [form, category]);

  const handleSubmit = form.handleSubmit((data: CreateCategoryDTO) => {
    if (category?.id) {
      console.log("update");
    } else {
      createCategory(data, {
        onSuccess: () => {
          callbackSuccess("create");
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
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input placeholder="Category image url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
