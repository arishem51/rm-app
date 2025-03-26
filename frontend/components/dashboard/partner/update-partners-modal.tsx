import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Partner, PartnerUpdateDTO } from "@/types/Api";
import { ToastTitle } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { useUpdatePartner } from "@/hooks/mutations/partner";

const partnerUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  phone: z.string().regex(/^(\+?\d{1,3})?\d{10}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  website: z.string().optional(),
  description: z.string().optional(),
  canHaveDebt: z.boolean().default(false),
});

type PartnerFormType = z.infer<typeof partnerUpdateSchema>;

type Props = {
  children?: ReactNode;
  partner?: Partner;
};

const PartnersUpdateModal = ({ children, partner }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<PartnerFormType>({
    resolver: zodResolver(partnerUpdateSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      contactName: "",
      address: "",
      website: "",
      description: "",
      canHaveDebt: false,
    },
  });
  const { mutate: updatePartner, isPending } = useUpdatePartner();
  const queryClient = useQueryClient();

  const { reset } = form;

  useEffect(() => {
    if (partner && open) {
      reset({
        name: partner.name || "",
        phone: partner.phone || "",
        email: partner.email || "",
        contactName: partner.contactName || "",
        address: partner.address || "",
        website: partner.website || "",
        description: partner.description || "",
        canHaveDebt: partner.canHaveDebt || false,
      });
    }
  }, [reset, partner, open]);

  const handleSubmit = form.handleSubmit((data) => {
    if (partner?.id) {
      updatePartner(
        {
          id: partner.id,
          ...data
        },
        {
          onSuccess: () => {
            toast({
              title: ToastTitle.success,
              description: "Partner updated successfully",
            });
            queryClient.invalidateQueries({
              queryKey: ApiQuery.partners.getPartners().queryKey,
            });
            setOpen(false);
          },
          onError: (e) => {
            toast({
              variant: "destructive",
              title: ToastTitle.error,
              description: e.message,
            });
          },
        }
      );
    }
  });

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleSubmit} className="mt-4">
            <DialogHeader>
              <DialogTitle>Edit partner</DialogTitle>
              <DialogDescription>
                Make changes to partners here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Partner name" {...field} />
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
                        <Input placeholder="Contact person name" {...field} />
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Full address" {...field} />
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
                        <Input placeholder="https://example.com" {...field} />
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
                        <Input placeholder="Brief description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canHaveDebt"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow Credit</FormLabel>
                        <FormDescription>
                          Partner can make purchases on credit
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default PartnersUpdateModal;