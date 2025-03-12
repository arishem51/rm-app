"use client";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMe, useUpdateUser } from "@/hooks/mutations/user";
import { UserRole, ActionStatus } from "@/lib/constants";
import { UserDTO } from "@/types/Api";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/ui/password-input";

type FormData = UserDTO & { newPassword?: string; confirmPassword?: string };

const schemaFields = {
  username: z.string(),
  name: z.string().nonempty({ message: "Tên là bắt buộc" }),
  newPassword: z.union([
    z.string().min(6, { message: "Mật khẩu phải dài ít nhất 6 ký tự" }),
    z.literal(""),
    z.null(),
  ]),
  confirmPassword: z.union([
    z.string().min(6, { message: "Mật khẩu phải dài ít nhất 6 ký tự" }),
    z.literal(""),
    z.null(),
  ]),
  phoneNumber: z
    .string()
    .regex(/^\d{10,12}$/, {
      message: "Số điện thoại phải dài từ 10-12 chữ số",
    })
    .nonempty({ message: "Số điện thoại là bắt buộc" }),
  role: z.enum([UserRole.ADMIN, UserRole.OWNER, UserRole.STAFF]),
  status: z.enum([ActionStatus.ACTIVE, ActionStatus.INACTIVE]),
};

const ProfileForm = () => {
  const { data: user } = useMe();
  const form = useForm<FormData>({
    defaultValues: { ...user, newPassword: "", confirmPassword: "" },
    resolver: zodResolver(
      z
        .object(schemaFields)
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        })
    ),
  });
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    if (user?.id) {
      const { newPassword, confirmPassword, ...rest } = data;
      void confirmPassword;
      updateUser(
        {
          ...rest,
          id: user.id,
          password: (isEmpty(newPassword)
            ? null
            : newPassword) as unknown as string,
        },
        {
          onSuccess: () => {
            toast({
              variant: "default",
              title: "Success",
              description: "Update account successfully",
            });
            queryClient.invalidateQueries({
              queryKey: ApiQuery.users.getMe().queryKey,
            });
          },
        }
      );
    }
  });

  return (
    <Form {...form}>
      <form className="w-1/2" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input readOnly {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Mật khẩu mới của bạn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Xác nhận mật khẩu của bạn"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(+84) 123 456 78" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Vai trò</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full pointer-events-none">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={UserRole.OWNER}>
                        Chủ cửa hàng
                      </SelectItem>
                      <SelectItem value={UserRole.STAFF}>Nhân viên</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isPending}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
