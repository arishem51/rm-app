import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateUserRequest, UserDTO } from "@/types/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToastTitle, UserRole, UserStatus } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUser } from "@/hooks/mutations/user";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { isEmpty } from "lodash";
import { PasswordInput } from "@/components/ui/password-input";

const schemaFields = {
  name: z.string().nonempty({ message: "Tên là bắt buộc" }),
  phoneNumber: z
    .string()
    .regex(/^\d{10,12}$/, {
      message: "Số điện thoại phải dài từ 10-12 chữ số",
    })
    .nonempty({ message: "Số điện thoại là bắt buộc" }),
  password: z.union([
    z.string().min(6, { message: "Mật khẩu phải dài ít nhất 6 ký tự" }),
    z.literal(""),
    z.literal(null),
  ]),
  confirmPassword: z.union([
    z.string().min(6, { message: "Mật khẩu phải dài ít nhất 6 ký tự" }),
    z.literal(""),
  ]),
  role: z.enum([UserRole.ADMIN, UserRole.OWNER, UserRole.STAFF]),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE]),
};

type Props = {
  children?: ReactNode;
  user?: UserDTO;
  isAdminPage?: boolean;
};

const UserUpdateModal = ({ children, isAdminPage = false, user }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateUserRequest & { confirmPassword?: string }>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      password: "",
      role: UserRole.ADMIN,
      confirmPassword: "",
    },
    resolver: zodResolver(
      z
        .object(schemaFields)
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        })
    ),
  });
  const { mutate: updateUser, isPending } = useUpdateUser();
  const queryClient = useQueryClient();
  const { reset } = form;

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        password: "",
        confirmPassword: "",
      });
    }
  }, [reset, user]);

  const handleSubmit = form.handleSubmit((data: UpdateUserRequest) => {
    if (user?.id) {
      updateUser(
        {
          id: user.id,
          ...data,
          password: (isEmpty(data.password)
            ? null
            : data.password) as unknown as string,
        },
        {
          onSuccess: () => {
            toast({
              title: ToastTitle.success,
              description: "User updated successfully",
            });
            if (isAdminPage) {
              queryClient.invalidateQueries({
                queryKey: ApiQuery.users.getUsers().queryKey,
              });
            } else {
              queryClient.invalidateQueries({
                queryKey: ApiQuery.shops.getShopDetails().queryKey,
              });
            }
            setOpen(false);
          },
          onError: (e) => {
            toast({
              title: ToastTitle.error,
              description: e.message,
              variant: "destructive",
            });
          },
        }
      );
    }
  });

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit} className="mt-4">
            <DialogHeader>
              <DialogTitle>Sửa thông tin</DialogTitle>
              <DialogDescription>
                Thay đổi thông tin của bạn ở đây. Nhấn lưu khi bạn đã hoàn
                thành.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 my-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Tên" {...field} />
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
                      <Input
                        type="tel"
                        placeholder="(+84) 123 456 78"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="*********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="*********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.role !== UserRole.ADMIN && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value={UserRole.OWNER}>
                                Chủ cửa hàng
                              </SelectItem>
                              <SelectItem value={UserRole.STAFF}>
                                Nhân viên
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {isAdminPage && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value={UserStatus.ACTIVE}>
                                Active
                              </SelectItem>
                              <SelectItem value={UserStatus.INACTIVE}>
                                Inactive
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default UserUpdateModal;
