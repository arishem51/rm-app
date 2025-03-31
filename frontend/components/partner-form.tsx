"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription,
} from "./ui/form";
import { cn } from "@/lib/utils";
import { PartnerCreateDTO, PartnerRepsponseDTO } from "@/types/Api";
import { Textarea } from "./ui/textarea";

const partnerFormSchema = z.object({
  name: z.string().optional(),
  contactName: z.string().min(1, "Bắt buộc"),
  phone: z.string().regex(/^(\+?\d{1,3})?\d{10}$/, "Không hợp lệ"),
  email: z.string().email("Không hợp lệ"),
  address: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  canHaveDebt: z.boolean().default(false),
});

type FormDataPartnerType = z.infer<typeof partnerFormSchema>;

type Props = {
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
  className?: string;
  btnText?: string;
  onSubmit: (data: PartnerCreateDTO) => void;
  partner?: PartnerRepsponseDTO;
};

const PartnerForm: FC<Props> = ({
  children,
  className,
  onSubmit,
  btnText = "Create Partner",
  partner,
}) => {
  const form = useForm<FormDataPartnerType>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
      website: "",
      description: "",
      canHaveDebt: false,
    },
  });

  useEffect(() => {
    if (partner) {
      form.reset(partner);
    }
  }, [partner, form]);

  const handleSubmit = form.handleSubmit(async (formData) => {
    onSubmit(formData);
  });

  return (
    <Form {...form}>
      <form
        className={cn(className, "space-y-6 flex flex-col")}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Công ty ABC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người đại diện</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(+84) 123 456 78" {...field} />
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
                  <Input placeholder="Ví dụ: contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Hà Nội" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Ví dụ: Đối tác cung cấp hàng hóa cho cửa hàng"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="canHaveDebt"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="leading-none">
                  <FormLabel>Nợ</FormLabel>
                  <FormDescription>
                    Cho phép đối tác này nợ tiền hàng hóa khi mua từ cửa hàng
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-6 w-1/6 ml-auto">
          {btnText}
        </Button>
        {children}
      </form>
    </Form>
  );
};

export default PartnerForm;
