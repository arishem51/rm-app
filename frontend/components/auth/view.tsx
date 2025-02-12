"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FC, ReactNode, useEffect } from "react";
import { useUserAtom } from "@/store/user";
import { useToast } from "@/hooks/use-toast";
import { useSignIn, useSignUp } from "@/hooks/mutations/user";
import { ToastTitle } from "@/lib/constants";
import AuthForm from "../auth-form";
import { useRouter } from "next/navigation";
import { setTokenAfterSignIn } from "@/server/actions";

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
  const [atom, setAtom] = useUserAtom();
  const { mutate: signIn } = useSignIn();
  const { mutate: signUp } = useSignUp();

  useEffect(() => {
    if (atom.showToastErrorSignIn) {
      toast({
        variant: "destructive",
        title: ToastTitle.somethingWentWrong,
        description: "Credentials expired, please sign in again!",
      });
      setAtom({ user: undefined, showToastErrorSignIn: false, token: "" });
      fetch(`${window.origin}/api/auth`, {
        method: "POST",
        credentials: "include",
      });
    }
  }, [atom.showToastErrorSignIn, setAtom, toast]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          onSubmit={(formData) => {
            if (type === "sign-up") {
              signUp(formData, {
                onError: () => {
                  toast({
                    variant: "destructive",
                    title: ToastTitle.error,
                    description: ToastTitle.somethingWentWrong,
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
                    variant: "destructive",
                    title: ToastTitle.error,
                    description: e.message,
                  });
                },
                onSuccess({ data }) {
                  if (data.data) {
                    toast({
                      title: ToastTitle.success,
                      description: "Sign in success!",
                    });

                    if (data.data.token) {
                      setTokenAfterSignIn(data.data.token);
                      setAtom({
                        user: data.data.user,
                        showToastErrorSignIn: false,
                        token: data.data.token,
                      });
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
