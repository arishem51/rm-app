"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FC, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSignIn, useSignUp } from "@/hooks/mutations/user";
import { ToastTitle } from "@/lib/constants";
import AuthForm from "../form/auth-form";
import { useRouter } from "next/navigation";
import { setTokenAfterSignIn } from "@/server/actions";
import { useAuthAtom } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  title?: string;
  description?: string;
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
  enableReCaptcha?: boolean;
};

const AuthView: FC<Props> = ({
  title,
  description,
  children,
  type = "sign-in",
  enableReCaptcha = false,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [atom, setAtom] = useAuthAtom();
  const { mutate: signIn } = useSignIn();
  const { mutate: signUp } = useSignUp();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (atom.showToastErrorSignIn) {
      toast({
        title: ToastTitle.somethingWentWrong,
        description: "Credentials expired, please sign in again!",
        variant: "destructive",
      });
      setAtom({ showToastErrorSignIn: false, token: "" });
      fetch(`${window.origin}/api/auth`, {
        method: "POST",
        credentials: "include",
      });
    }
  }, [atom.showToastErrorSignIn, setAtom, toast]);

  return (
    <Card className="mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>{title}</span>
          <Button
            className="h-6 w-6 ml-auto"
            size="icon"
            variant="outline"
            asChild
          >
            <Link href={type === "sign-up" ? "/auth/sign-in" : "/"}>
              <Home />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          enableReCaptcha={enableReCaptcha}
          onSubmit={(formData, config) => {
            if (type === "sign-up") {
              signUp(formData, {
                onError: (e) => {
                  toast({
                    title: ToastTitle.error,
                    description: e.message || ToastTitle.somethingWentWrong,
                    variant: "destructive",
                  });
                  config?.onError?.();
                },
                onSuccess: () => {
                  toast({
                    title: ToastTitle.success,
                    description: "Đăng ký thành công!",
                  });
                  config?.onSuccess?.();
                  setTimeout(() => {
                    router.replace("/auth/sign-in");
                  }, 400);
                },
              });
            } else {
              if (formData.reCaptchaToken) {
                signIn(
                  {
                    ...formData,
                    reCaptchaToken: formData.reCaptchaToken,
                  },
                  {
                    onError: (e) => {
                      toast({
                        title: ToastTitle.error,
                        description: e.message,
                        variant: "destructive",
                      });
                      config?.onError?.();
                    },
                    async onSuccess({ data }) {
                      if (data.data) {
                        toast({
                          title: ToastTitle.success,
                          description: "Đăng nhập thành công!",
                        });
                        if (data.data.token) {
                          setTokenAfterSignIn(data.data.token);
                          setAtom({
                            showToastErrorSignIn: false,
                            token: data.data.token,
                          });
                          await queryClient.invalidateQueries(
                            ApiQuery.users.getMe()
                          );
                          setTimeout(() => {
                            router.replace("/dashboard");
                          }, 50);
                        }
                        config?.onSuccess?.();
                      }
                    },
                  }
                );
              } else {
                console.debug("reCaptchaToken is required");
                console.error("reCaptchaToken is required");
                console.log("reCaptchaToken is required");
              }
            }
          }}
          type={type}
        >
          {children}
        </AuthForm>
      </CardContent>
    </Card>
  );
};

export default AuthView;
