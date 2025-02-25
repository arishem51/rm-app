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
import { Button } from "../ui/button";

type Props = {
  title?: string;
  description?: string;
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
};

const AuthView: FC<Props> = ({
  title,
  description,
  children,
  type = "sign-in",
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
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>{title}</span>
          {type === "sign-up" && (
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
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          onSubmit={(formData) => {
            if (type === "sign-up") {
              signUp(formData, {
                onError: (e) => {
                  toast({
                    title: ToastTitle.error,
                    description: e.message || ToastTitle.somethingWentWrong,
                    variant: "destructive",
                  });
                },
                onSuccess: () => {
                  toast({
                    title: ToastTitle.success,
                    description: "Sign up success!",
                  });
                  setTimeout(() => {
                    router.replace("/auth/sign-in");
                  }, 400);
                },
              });
            } else {
              signIn(formData, {
                onError: (e) => {
                  toast({
                    title: ToastTitle.error,
                    description: e.message,
                    variant: "destructive",
                  });
                },
                async onSuccess({ data }) {
                  if (data.data) {
                    toast({
                      title: ToastTitle.success,
                      description: "Sign in success!",
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
                  }
                },
              });
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
