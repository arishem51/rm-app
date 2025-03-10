"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, ReactNode } from "react";
import { useForm } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./ui/form";
import { cn } from "@/lib/utils";

type FormDataPartnerType = {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  taxCode: string;
  address: string;
  website: string;
  description: string;
};

type Props = {
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
  className?: string;
  btnText?: string;
  onSubmit: (data: FormDataPartnerType) => void;
};

const PartnerForm: FC<Props> = ({ children, className, onSubmit }) => {
  const form = useForm<FormDataPartnerType>({
    defaultValues: {
      name: "",
      contactName: "",
      phone: "",
      email: "",
      taxCode: "",
      address: "",
      website: "",
      description: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    const { ...rest } = formData;
    onSubmit(rest);
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

        {/* <FormField
          control={form.control}
          name="taxCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax code</FormLabel>
              <FormControl>
                <Input placeholder="Tax code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Button type="submit" className="w-full">
          Create Partner
        </Button>
        {children}
      </form>
    </Form>
  );
};

export default PartnerForm;
