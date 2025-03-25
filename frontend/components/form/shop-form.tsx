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
import { useEffect, useState } from "react";
import { UserRole } from "@/lib/constants";
import { useMe } from "@/hooks/mutations/user";
import { useRouter } from "next/navigation";
import Select from "react-select"; // Import React Select

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
  name: z.string().nonempty({ message: "Tên cửa hàng là bắt buộc" }),
  ownerName: z.string().nonempty({ message: "Tên chủ cửa hàng là bắt buộc" }),
  address: z.string().nonempty({ message: "Địa chỉ là bắt buộc" }),
  phoneNumber: z
    .string()
    .nonempty({ message: "Số điện thoại là bắt buộc" })
    .regex(/^[0-9]{10,12}$/, { message: "Số điện thoại không hợp lệ" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  website: z.string().url().optional(),
  socialMedia: z.string().url().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(), // Thêm trường ngân hàng
  postalCode: z
    .string()
    .regex(/^[0-9]{5,6}$/, { message: "Mã bưu điện không hợp lệ" }),
};

type Props = {
  onClose?: () => void;
  shop?: ShopDTO;
};

const ShopForm = ({ onClose, shop }: Props) => {
  const [shopImage, setShopImage] = useState<string | null>(shop?.image || null); // State lưu hình ảnh
  const form = useForm<UpdateShopDTO>({
    defaultValues: shop ?? {
      name: "",
      ownerName: "",
      address: "",
      phoneNumber: "",
      email: "",
      website: "",
      socialMedia: "",
      bankAccount: "",
      bankName: "",
      postalCode: "",
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
      form.reset(shop);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setShopImage(reader.result as string); // Hiển thị hình ảnh đã tải lên
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = form.handleSubmit((data: UpdateShopDTO) => {
    if (shop?.id) {
      updateShop(
        { id: shop.id, ...data, image: shopImage }, // Gửi hình ảnh cùng dữ liệu
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
        <div className="flex flex-col md:flex-row gap-4">
          {/* Form Fields */}
          <div className="flex-1 flex flex-col gap-2 mb-4">
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
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chủ cửa hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Nguyễn Văn A" {...field} />
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 0987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: example@gmail.com" {...field} />
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
                    <Input placeholder="Ví dụ: https://example.com" {...field} />
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
                  <FormLabel>Fanpage</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: https://facebook.com/example" {...field} />
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
                  <FormLabel>Số tài khoản ngân hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 123456789" {...field} />
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
                  <FormLabel>Ngân hàng</FormLabel>
                  <FormControl>
                    <Select
                      options={bankOptions}
                      placeholder="Chọn ngân hàng"
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                      value={bankOptions.find(
                        (option) => option.value === field.value
                      )}
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
          </div>

          {/* Shop Image Upload */}
          <div className="flex-1 flex flex-col items-center justify-center border border-gray-300 rounded-lg p-4">
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              {shopImage ? (
                <img
                  src={shopImage}
                  alt="Hình ảnh cửa hàng"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500">Chưa có hình ảnh</span>
              )}
            </div>
            <label
              htmlFor="shopImage"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
            >
              Tải lên hình ảnh cửa hàng
            </label>
            <input
              id="shopImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
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