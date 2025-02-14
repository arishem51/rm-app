import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateUserRequest, UserDTO } from "@/types/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserRole, UserStatus } from "@/lib/constants";
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
import { useUserAtomValue } from "@/store/user";
import { isEmpty } from "lodash";

const schemaFields = {
  name: z.string().nonempty({ message: "Name is required" }),
  phoneNumber: z
    .string()
    .regex(/^\d{10,12}$/, {
      message: "Phone number must be 10-12 digits long",
    })
    .nonempty({ message: "Phone number is required" }),
  password: z
    .union([
      z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
      z.literal(""),
      z.literal(null),
    ])
    .optional(),
  role: z.enum([UserRole.ADMIN, UserRole.OWNER, UserRole.STAFF]),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE]),
};

type Props = {
  children?: ReactNode;
  user?: UserDTO;
};

const UserUpdateModal = ({ children, user }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateUserRequest>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      password: "",
      role: UserRole.ADMIN,
    },
    resolver: zodResolver(z.object(schemaFields)),
  });
  const { mutate: updateUser, isPending } = useUpdateUser();
  const queryClient = useQueryClient();
  const { user: currentUser } = useUserAtomValue();

  const { setValue } = form;
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("phoneNumber", user.phoneNumber);
      setValue("role", user.role);
      setValue("status", user.status);
    }
  }, [setValue, user]);

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
              variant: "default",
              title: "Success",
              description: "User updated successfully",
            });
            queryClient.invalidateQueries({
              queryKey: ApiQuery.users.getUsers().queryKey,
            });
            setOpen(false);
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
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 my-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
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
                    <div className="flex justify-between">
                      <FormLabel>New Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {currentUser?.role === UserRole.ADMIN && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
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
                                Owner
                              </SelectItem>
                              <SelectItem value={UserRole.STAFF}>
                                Staff
                              </SelectItem>
                              <SelectItem value={UserRole.ADMIN}>
                                Admin
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
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
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default UserUpdateModal;
