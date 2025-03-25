import { useForm } from "react-hook-form";
import { UpdateShopDTO, ShopDTO } from "@/types/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useUpdateShop } from "@/hooks/mutations/shop";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { useEffect } from "react";
import { UserRole } from "@/lib/constants";
import { useMe } from "@/hooks/mutations/user";
import { useRouter } from "next/navigation";
import Select from "react-select";

// Danh sách ngân hàng Việt Nam
const bankOptions = [
  { value: "vietcombank", label: "Vietcombank" },
  { value: "vietinbank", label: "Vietinbank" },
  { value: "techcombank", label: "Techcombank" },
  { value: "bidv", label: "BIDV" },
  { value: "mbbank", label: "MB Bank" },
  { value: "agribank", label: "Agribank" },
  { value: "acb", label: "ACB" },
  { value: "vpbank", label: "VPBank" },
  { value: "sacombank", label: "Sacombank" },
];

const schemaFields = {
  name: z.string().min(1, "Tên cửa hàng không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  postalCode: z.string().optional(),
  socialMedia: z.string().optional(),
  website: z.string().optional(),
};

type Props = {
  onClose?: () => void;
  shop?: ShopDTO;
};

const ShopForm = ({ onClose, shop }: Props) => {
  const form = useForm<UpdateShopDTO>({
    defaultValues: shop ?? {
      name: "",
      address: "",
      bankAccount: "",
      bankName: "",
      postalCode: "",
      socialMedia: "",
      website: "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });

  const { mutate: updateShop, isPending: isUpdating } = useUpdateShop();
  const isPending = isUpdating;
  const queryClient = useQueryClient();
  const { data: user } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (shop) {
      form.reset({
        name: shop.name || "",
        address: shop.address || "",
        bankAccount: shop.bankAccount || "",
        bankName: shop.bankName || "",
        postalCode: shop.postalCode || "",
        socialMedia: shop.socialMedia || "",
        website: shop.website || "",
      });
    }
  }, [form, shop]);

  const callbackSuccess = async (type: "create" | "update") => {
    toast({
      variant: "default",
      title: "Success",
      description: `${type === "create" ? "Tạo" : "Sửa"} cửa hàng thành công`,
    });
    onClose?.();
    queryClient.invalidateQueries({
      queryKey: ApiQuery.shops.getShops().queryKey,
    });
    if (user?.role !== UserRole.ADMIN && type === "create") {
      queryClient.invalidateQueries({
        queryKey: ApiQuery.users.getMe().queryKey,
      });
    }
    router.push("/dashboard");
  };

  const handleSubmit = form.handleSubmit((data: UpdateShopDTO) => {
    if (shop?.id) {
      updateShop(
        { id: shop.id, ...data },
        {
          onSuccess: () => {
            callbackSuccess("update");
          },
        }
      );
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên cửa hàng</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Gạo Hưng Thịnh" {...field} />
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
                  <Input placeholder="Ví dụ: Hà Đông, Hà Nội" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tài khoản</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: 1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên ngân hàng</FormLabel>
                <FormControl>
                  <Select
                    options={bankOptions}
                    placeholder="Chọn ngân hàng"
                    value={bankOptions.find(option => option.value === field.value)}
                    onChange={(option) => field.onChange(option?.value)}
                    isClearable
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã bưu điện</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: 100000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialMedia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mạng xã hội</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: facebook.com/shop" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: www.shop.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ShopForm;