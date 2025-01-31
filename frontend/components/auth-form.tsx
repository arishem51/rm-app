"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, Fragment, ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUserAtom } from "@/store/user";
import { apiClient } from "@/lib/utils";
import { setTokenAfterSignIn } from "@/server/actions";
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
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,12}$/, {
      message: "Phone number must be 10-12 digits long",
    })
    .nonempty({ message: "Phone number is required" }),
  name: z.string().nonempty({ message: "Name is required" }),
  role: z.enum(["OWNER", "STAFF"]),
};

type Props = {
  title?: string;
  description?: string;
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
};

const AuthForm: FC<Props> = ({
  title,
  description,
  children,
  type = "sign-in",
}) => {
  const isSignUp = type === "sign-up";
  const router = useRouter();
  const form = useForm<{
    username: string;
    password: string;
    name: string;
    phoneNumber: string;
  }>({
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
  const { toast } = useToast();
  const [atom, setAtom] = useUserAtom();

  useEffect(() => {
    if (atom.showToastErrorSignIn) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Credentials expired, please sign in again.",
      });
      setAtom({ user: undefined, showToastErrorSignIn: false });
      fetch(`${window.origin}/api/auth`, {
        method: "POST",
        credentials: "include",
      });
    }
  }, [atom.showToastErrorSignIn, setAtom, toast]);

  const onSubmit = form.handleSubmit(async (formData) => {
    const { username, password } = formData;
    try {
      if (isSignUp) {
        await apiClient.signUp(formData);
      } else {
        const { data } = await apiClient.signIn({
          username,
          password,
        });
        if (data.data) {
          if (data.data.token) {
            setTokenAfterSignIn(data.data.token);
          }
          setAtom({
            user: data.data.user,
            showToastErrorSignIn: false,
            token: data.data.token,
          });
        }
      }
      toast({
        title: isSignUp ? "Sign up successfully!" : "Sign in successfully!",
        description: isSignUp
          ? "You can sign in to the app now!"
          : "Welcome to Rice Management App.",
      });
      setTimeout(
        () => {
          router.replace(isSignUp ? "/auth/sign-in" : "/dashboard");
        },
        isSignUp ? 500 : 0
      );
    } catch {
      toast({
        variant: "destructive",
        title: isSignUp ? "Sign up failed!" : "Sign in failed!",
        description: isSignUp
          ? "Something went wrong!"
          : "Please check your username and password.",
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="mx-auto max-w-sm ">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
              </div>
              <Button type="submit" className="w-full">
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
              {children}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default AuthForm;
