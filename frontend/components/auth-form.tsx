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
} from "./ui/form";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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
    .regex(/^[0-9]{10,12}$/, {
      message: "Phone number must be 10-12 digits long",
    })
    .nonempty({ message: "Phone number is required" }),
};

type FormDataType = {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
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
    },
    resolver: zodResolver(
      z.object(isSignUp ? signUpSchemaFields : signInSchemaFields)
    ),
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    onSubmit(formData);
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
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
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
                <FormLabel className="flex justify-between">
                  Password
                  {!isSignUp && (
                    <span
                      className="text-sm ml-auto hover:underline underline-offset-4 cursor-pointer text-white"
                      onClick={() => {
                        toast({
                          variant: "default",
                          title: "Feature not available!",
                          description:
                            "Please contact the admin to reset your password.",
                        });
                      }}
                    >
                      Forgot you password?
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          {btnText ? btnText : isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        {children}
      </form>
    </Form>
  );
};

export default AuthForm;
