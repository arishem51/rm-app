"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useResetPassword } from "@/hooks/mutations/user";
import { toast } from "@/hooks/use-toast";
import { ToastTitle } from "@/lib/constants";
import { ResetPasswordRequest } from "@/types/Api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordInput } from "@/components/ui/password-input";
import { Home } from "lucide-react";

type Props = {
  token: string;
};

type FormData = ResetPasswordRequest & {
  confirmPassword: string;
};

const schemaFields = {
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
};

const ResetPasswordView = ({ token }: Props) => {
  const form = useForm<FormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
      token,
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
  const { mutate: resetPassword, isPending } = useResetPassword();
  const router = useRouter();

  const handleSubmit = form.handleSubmit((data: FormData) => {
    resetPassword(
      { token, password: data.password },
      {
        onSuccess: () => {
          toast({
            title: ToastTitle.success,
            description: "Reset password successfully",
          });
          router.push("/auth/sign-in");
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
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center">
          <span>Reset password</span>
          <Button
            className="h-6 w-6 ml-auto"
            size="icon"
            variant="outline"
            onClick={() => {
              router.replace("/auth/sign-in");
            }}
          >
            <Home />
          </Button>
        </CardTitle>
        <CardDescription>
          You&apos;re almost there! Enter your new password below to reset your
          account. Make sure to choose a strong password for better security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Mật khẩu mới của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
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
            <Button className="w-full" type="submit" disabled={isPending}>
              Lưu
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordView;
