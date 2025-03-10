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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { useUpdatePartner } from "@/hooks/mutations/partner";

type Props = {
  children?: ReactNode;
  partner?: Partner;
};

const PartnersUpdateModal = ({ children, partner }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<PartnerUpdateDTO>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      contactName: "",
      address: "",
      website: "",
      description: "",
      // taxCode: "", ???
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
        // taxCode: partner.taxCode || "",
      });
    }
  }, [reset, partner, open]);

  const handleSubmit = form.handleSubmit(() => {
    if (partner?.id) {
      updatePartner(
          {
              id: partner.id,
              ...form.getValues()
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
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit} className="mt-4">
            <DialogHeader>
              <DialogTitle>Edit partner</DialogTitle>
              <DialogDescription>
                Make changes to partners here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 my-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
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

              {/*<FormField
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
              />*/}
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
