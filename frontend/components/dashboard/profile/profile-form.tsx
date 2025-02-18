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
import { useUpdateUser } from "@/hooks/mutations/user";
import { UserRole } from "@/lib/constants";
import { UserDTO } from "@/types/Api";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";

type Props = {
  user: UserDTO;
};

type FormData = UserDTO & { newPassword?: string };

const ProfileForm = ({ user }: Props) => {
  const form = useForm<FormData>({
    defaultValues: { ...user, newPassword: "" },
  });
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    if (user.id) {
      const { newPassword } = data;
      updateUser(
        {
          ...data,
          password: (isEmpty(newPassword)
            ? null
            : newPassword) as unknown as string,
        },
        {
          onSuccess: () => {
            form.reset();
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
                <Input
                  type="password"
                  placeholder="Your new password"
                  {...field}
                />
              </FormControl>
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
