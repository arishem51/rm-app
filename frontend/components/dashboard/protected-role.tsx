"use client";

import { UserDTO } from "@/types/Api";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import UnSupportRole from "../view/un-support-role";
import { AppRoutes, UserRole } from "@/lib/constants";
import { AppRoutesType, RouteItem } from "@/types";

type Props = {
  children: ReactNode;
  user: UserDTO;
};

const ProtectedRole = ({ children, user }: Props) => {
  const pathname = usePathname();

  const checkUrlAndPathname = (url: string) => {
    if (url.includes("[") && url.includes("]")) {
      url = url.substring(0, url.lastIndexOf("/"));
      return url === pathname.substring(0, pathname.lastIndexOf("/"));
    }
    return url === pathname;
  };

  const checkSupportRole = () => {
    let isSupport = false;
    const checkRouteSupportRole = ({ url, role }: RouteItem) => {
      const result =
        checkUrlAndPathname(url) && (user.role === role || role === "ALL");
      if (result) {
        isSupport = true;
      }
      return result;
    };
    const entriesRoutes = (routes: AppRoutesType): boolean => {
      return Object.values(routes).some((value) => {
        if ("role" in value && "url" in value) {
          return checkRouteSupportRole(value as RouteItem);
        }
        return entriesRoutes(value);
      });
    };

    entriesRoutes(AppRoutes);
    return isSupport;
  };
  const isSupport = checkSupportRole();

  if (user.role !== UserRole.ADMIN && !isSupport) {
    return <UnSupportRole />;
  }

  return children;
};

export default ProtectedRole;
