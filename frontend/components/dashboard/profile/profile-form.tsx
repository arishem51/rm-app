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
import { UserRole, UserStatus } from "@/lib/constants";
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
  name: z.string().nonempty({ message: "Name is required" }),
  newPassword: z.union([
    z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    z.literal(""),
    z.null(),
  ]),
  confirmPassword: z.union([
    z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    z.literal(""),
    z.null(),
  ]),
  phoneNumber: z
    .string()
    .regex(/^\d{10,12}$/, {
      message: "Phone number must be 10-12 digits long",
    })
    .nonempty({ message: "Phone number is required" }),
  role: z.enum([UserRole.ADMIN, UserRole.OWNER, UserRole.STAFF]),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE]),
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
              <FormLabel>Username</FormLabel>
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
              <FormLabel>Name</FormLabel>
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
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Your new password" {...field} />
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Your confirm password" {...field} />
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
              <FormLabel>Phone number</FormLabel>
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
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full pointer-events-none">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                      <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
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
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
