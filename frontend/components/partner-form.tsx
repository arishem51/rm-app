"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./ui/form";
import { cn } from "@/lib/utils";
import { PartnerCreateDTO } from "@/types/Api";

const partnerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  phone: z.string().regex(/^(\+?\d{1,3})?\d{10}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  website: z.string().optional(),
  description: z.string().optional(),
});

type FormDataPartnerType = z.infer<typeof partnerFormSchema>;

type Props = {
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
  className?: string;
  btnText?: string;
  onSubmit: (data: PartnerCreateDTO) => void;
};

const PartnerForm: FC<Props> = ({ children, className, onSubmit, btnText = "Create Partner" }) => {
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
    },
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    onSubmit(formData);
  });

  return (
    <Form {...form}>
      <form className={cn(className, "space-y-4")} onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
              <FormLabel>Phone Number</FormLabel>
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
                <Input placeholder="Email" {...field} />
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
              <FormLabel>Contact name</FormLabel>
              <FormControl>
                <Input placeholder="Contact name" {...field} />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
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
                <Input placeholder="Website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {btnText}
        </Button>
        {children}
      </form>
    </Form>
  );
};

export default PartnerForm;
