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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = {
  email: string;
};

const schemaFields = {
  email: z.string().email({ message: "Invalid email address" }),
};

const ForgotPasswordView = () => {
  const form = useForm<FormData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const router = useRouter();

  const handleSubmit = form.handleSubmit((data: FormData) => {
    forgotPassword(data, {
      onSettled: () => {
        toast({
          title: ToastTitle.success,
          description:
            "We have sent to your email a link to reset your password",
        });
        router.push("/auth/sign-in");
      },
    });
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>Forgot password</span>
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
        </CardTitle>
        <CardDescription>
          Forgot your password? No worries! Enter your email below to reset it.
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
            <Button className="w-full" type="submit" disabled={isPending}>
              Reset password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordView;
