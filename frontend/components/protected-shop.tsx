"use client";

import { useMe } from "@/hooks/mutations/user";
import { toast } from "@/hooks/use-toast";
import { ToastTitle } from "@/lib/constants";
import { checkRole } from "@/lib/helpers";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  shouldAdminByPass?: boolean;
  fallback:
    | {
        view: ReactNode;
      }
    | {
        redirectPath: string;
      };
};

const ProtectedShop = ({
  children,
  fallback,
  shouldAdminByPass = false,
}: Props) => {
  const { data: user } = useMe();
  const { isAdmin } = checkRole(user);

  const shouldRenderChildren = user?.shopId || (shouldAdminByPass && isAdmin);

  useEffect(() => {
    if (!shouldRenderChildren) {
      toast({
        title: ToastTitle.error,
        description: "You must have a shop to access this page",
      });
    }
  }, [shouldRenderChildren]);

  const fallbackReturn =
    "view" in fallback ? fallback.view : redirect(fallback.redirectPath);

  return shouldRenderChildren ? children : fallbackReturn;
};

export default ProtectedShop;
