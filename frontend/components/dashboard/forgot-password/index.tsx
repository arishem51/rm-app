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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/mutations/user";
import { toast } from "@/hooks/use-toast";
import { ToastTitle } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = {
  email: string;
  reCaptchaToken: string;
};

const schemaFields = {
  email: z.string().email({ message: "Invalid email address" }),
  reCaptchaToken: z.string(),
};

const ForgotPasswordView = () => {
  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      reCaptchaToken: "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });
  const { mutate: forgotPassword } = useForgotPassword();
  const router = useRouter();
  const recaptchaToken = form.watch("reCaptchaToken");

  const handleSubmit = form.handleSubmit((data: FormData) => {
    forgotPassword(data);
    toast({
      title: ToastTitle.success,
      description: "Chúng tôi đã gửi một email để đặt lại mật khẩu của bạn.",
    });
    router.push("/auth/sign-in");
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>Quên mật khẩu</span>
          <Button
            className="h-6 w-6 ml-auto"
            size="icon"
            variant="outline"
            asChild
          >
            <Link href="/auth/sign-in" prefetch>
              <Home />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          Nhập email của bạn bên dưới để đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
            <ReCAPTCHA
              sitekey="6LcM5-sqAAAAAGFDvyWQMFKDD4I8M69WxyUqtpPe"
              onChange={(token) => {
                if (token) {
                  form.setValue("reCaptchaToken", token);
                }
              }}
            />
            <Button className="w-full" type="submit" disabled={!recaptchaToken}>
              Đặt lại mật khẩu
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordView;
