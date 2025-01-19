"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, Fragment, ReactNode, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Controller, useForm } from "react-hook-form";
import { signIn } from "@/server/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";

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
  const router = useRouter();
  const form = useForm<{
    username: string;
    password: string;
    name: string;
    phoneNumber: string;
    role: "OWNER" | "STAFF";
  }>({
    defaultValues: {
      username: "",
      password: "",
      name: "",
      phoneNumber: "",
      role: "OWNER",
    },
  });
  const { toast } = useToast();
  const [atom, setAtom] = useAtom(userAtom);

  useEffect(() => {
    if (atom.showToastErrorSignIn) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Credentials expired, please sign in again.",
      });
      setAtom({ user: undefined, showToastErrorSignIn: false });
    }
  }, [atom.showToastErrorSignIn, setAtom, toast]);

  const isSignUp = type === "sign-up";
  const onSubmit = form.handleSubmit(async ({ username, password }) => {
    try {
      const result = await signIn({ username, password });
      if (result.data) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
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
                <div className="space-y-1">
                  <Label htmlFor="username">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...form.register("name")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Phone number</Label>
                  <Input
                    id="phoneNumber"
                    type="text"
                    placeholder="(+84) 123 456 78"
                    {...form.register("phoneNumber")}
                  />
                </div>
              </Fragment>
            )}
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                {...form.register("username")}
              />
            </div>
            <div className="space-y-1">
              <div className="flex">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <span
                    className="text-sm ml-auto hover:underline underline-offset-4 cursor-pointer"
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
              </div>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                {...form.register("password")}
              />
            </div>
            {isSignUp && (
              <div className="space-y-1">
                <Label htmlFor="username">Role</Label>
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="OWNER">Owner</SelectItem>
                          <SelectItem value="STAFF">Staff</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            {children}
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default AuthForm;
