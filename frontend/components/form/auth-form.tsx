"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, Fragment, ReactNode } from "react";
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

const signInSchemaFields = {
  username: z
    .string()
    .min(3, { message: "Username must be between 3 and 20 characters" })
    .max(20, { message: "Username must be between 3 and 20 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
};

const signUpSchemaFields = {
  ...signInSchemaFields,
  name: z.string().nonempty({ message: "Name is required" }),
  phoneNumber: z
    .string()
    .regex(/^\d{10,12}$/, {
      message: "Phone number must be 10-12 digits long",
    })
    .nonempty({ message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
};

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
};

const AuthForm: FC<Props> = ({
  children,
  type = "sign-in",
  className,
  btnText,
  onSubmit,
}) => {
  const isSignUp = type === "sign-up";
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Account Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Public account display name, visible to others.
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
          </Fragment>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
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
                  <FormLabel>Confirm Password</FormLabel>
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
