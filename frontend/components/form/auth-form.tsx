"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, Fragment, ReactNode, useMemo, useRef, useState } from "react";
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
import { PasswordInput } from "../ui/password-input";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

type FormDataType = {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
  email: string;
  confirmPassword?: string;
  reCaptchaToken?: string;
};

type Props = {
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
  className?: string;
  btnText?: string;
  onSubmit: (
    data: FormDataType,
    config?: { onError?: () => void; onSuccess?: () => void }
  ) => void;
  requireEmail?: boolean;
  enableReCaptcha?: boolean;
};

const AuthForm: FC<Props> = ({
  children,
  type = "sign-in",
  className,
  btnText,
  onSubmit,
  requireEmail = true,
  enableReCaptcha = false,
}) => {
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const reCaptchaRef = useRef<ReCAPTCHA>(null);
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
        .min(6, { message: "Mật khẩu phải dài ít nhất 6 ký tự" }),
      reCaptchaToken: z.string().optional(),
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
          message: "Số điện thoại phải dài từ 10-12 chữ số",
        })
        .nonempty({ message: "Số điện thoại là bắt buộc" }),
      confirmPassword: z
        .string()
        .min(6, { message: "Mật khẩu phải dài ít nhất 6 ký tự" }),
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
      reCaptchaToken: "",
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
            message: "Mật khẩu không khớp",
            path: ["confirmPassword"],
          }
        )
    ),
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    const { confirmPassword, ...rest } = formData;
    void confirmPassword;
    onSubmit(rest, {
      onError: () => {
        setRecaptchaToken("");
        reCaptchaRef.current?.reset();
      },
    });
  });

  return (
    <Form {...form}>
      <form className={cn(className, "space-y-4")} onSubmit={handleSubmit}>
        {isSignUp && (
          <Fragment>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên của bạn" {...field} />
                    </FormControl>
                    <FormDescription>
                      Tên hiển thị của tài khoản công khai, người khác có thể
                      nhìn thấy.
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
            </div>
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
                  <FormLabel>Mật khẩu</FormLabel>
                  {!isSignUp && (
                    <Link
                      href="/auth/forgot-password"
                      className="underline underline-offset-4"
                      prefetch
                    >
                      <span className="text-sm ml-auto hover:underline underline-offset-4 cursor-pointer">
                        Quên mật khẩu?
                      </span>
                    </Link>
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
        {enableReCaptcha && (
          <div data-testid="recatpcha">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              ref={reCaptchaRef}
              onChange={(token) => {
                if (token) {
                  setRecaptchaToken(token);
                  form.setValue("reCaptchaToken", token);
                }
              }}
            />
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={enableReCaptcha && !recaptchaToken}
        >
          {btnText ?? (isSignUp ? "Đăng ký" : "Đăng nhập")}
        </Button>
        {children}
      </form>
    </Form>
  );
};

export default AuthForm;
