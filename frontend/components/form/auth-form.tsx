"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, Fragment, ReactNode, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PasswordInput } from "../ui/password-input";

type FormDataType = {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
  email: string;
  confirmPassword?: string;
};

type Props = {
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
  className?: string;
  btnText?: string;
  onSubmit: (data: FormDataType) => void;
  requireEmail?: boolean;
};

const AuthForm: FC<Props> = ({
  children,
  type = "sign-in",
  className,
  btnText,
  onSubmit,
  requireEmail = true,
}) => {
  const isSignUp = type === "sign-up";
  const signInSchemaFields = useMemo(
    () => ({
      username: z
        .string()
        .min(3, {
          message: "Tên đăng nhập có độ dài ít nhất 3 ký tự và tối đa là 20",
        })
        .max(20, {
          message: "Tên đăng nhập có độ dài ít nhất 3 ký tự và tối đa là 20",
        }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    }),
    []
  );

  const signUpSchemaFields = useMemo(() => {
    const schemaFields = {
      ...signInSchemaFields,
      name: z.string().nonempty({ message: "Tên là bắt buộc" }),
      phoneNumber: z
        .string()
        .regex(/^\d{10,12}$/, {
          message: "Phone number must be 10-12 digits long",
        })
        .nonempty({ message: "Phone number is required" }),
      confirmPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    };
    if (requireEmail) {
      return {
        ...schemaFields,
        email: z.string().email({ message: "Invalid email" }),
      };
    }
    return schemaFields;
  }, [requireEmail, signInSchemaFields]);

  const form = useForm<FormDataType>({
    defaultValues: {
      username: "",
      password: "",
      name: "",
      phoneNumber: "",
      email: "",
      confirmPassword: "",
    },
    resolver: zodResolver(
      z
        .object(isSignUp ? signUpSchemaFields : signInSchemaFields)
        .refine(
          (data) =>
            isSignUp
              ? data.password ===
                (data as { confirmPassword?: string })?.confirmPassword
              : true,
          {
            message: "Passwords don't match",
            path: ["confirmPassword"],
          }
        )
    ),
  });
  const router = useRouter();

  const handleSubmit = form.handleSubmit(async (formData) => {
    const { confirmPassword, ...rest } = formData;
    void confirmPassword;
    onSubmit(rest);
  });

  return (
    <Form {...form}>
      <form className={cn(className, "space-y-4")} onSubmit={handleSubmit}>
        {isSignUp && (
          <Fragment>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Account Tên" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tên hiển thị của tài khoản công khai, người khác có thể nhìn
                    thấy.
                  </FormDescription>
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
            {requireEmail && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </Fragment>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input placeholder="Tên đăng nhập" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-1">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  {!isSignUp && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        router.push("/auth/forgot-password");
                      }}
                    >
                      <span className="text-sm ml-auto hover:underline underline-offset-4 cursor-pointer">
                        Forgot you password?
                      </span>
                    </Button>
                  )}
                </div>
                <FormControl>
                  <PasswordInput placeholder="*********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isSignUp && (
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
          )}
        </div>
        <Button type="submit" className="w-full">
          {btnText ?? (isSignUp ? "Sign Up" : "Sign In")}
        </Button>
        {children}
      </form>
    </Form>
  );
};

export default AuthForm;
