"use client";

import {
  Box,
  Briefcase,
  ChevronsUpDown,
  Home,
  LucideIcon,
  ShoppingBag,
  Store,
  TagIcon,
  User2,
  Users,
  Warehouse,
  MessageSquarePlus
} from "lucide-react";
import { BadgeCent } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { AppRoutes } from "@/lib/constants";
import { checkRole } from "@/lib/helpers";
import { useMe } from "@/hooks/mutations/user";
import { ShoppingBasket } from "lucide-react";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
type Item = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  children?: Item[];
};

type SidebarGroupType = "application" | "shop" | "setting";

const Content = () => {
  const query = useMe();
  const { data: user } = query ?? {};
  const { isAdmin, isOwner, isStaff } = checkRole(user);
  const { data: requests } = useAppQuery(ApiQuery.requests.getAllRequests());
  const pendingRequests = requests?.data.length || 0; 
  const itemGroups: Record<
    SidebarGroupType,
    {
      title: string;
      items: Item[];
    }
  > = {
    application: {
      title: "Ứng dụng",
      items: [
        {
          title: "Trang chủ",
          url: AppRoutes.dashboard.home.url,
          icon: Home,
        },
      ],
    },
    shop: {
      title: "Quản lý cửa hàng",
      items: [],
    },
    setting: {
      title: "Setting",
      items: [
        {
          title: "Thông tin cá nhân",
          url: AppRoutes.dashboard.setting.profile.url,
          icon: User2,
        },
      ],
    },
  };

  if (isAdmin) {
    itemGroups.application.items.push(
      {
        title: "Tài khoản",
        icon: Users,
        url: AppRoutes.dashboard.users.url,
        children: [],
      },
      {
        title: "Cửa hàng",
        url: AppRoutes.dashboard.shops.url,
        icon: Store,
      },
      {
        title: "Danh mục",
        url: AppRoutes.dashboard.categories.url,
        icon: TagIcon,
      },
      {
        title: "Đối tác",
        url: AppRoutes.dashboard.partners.url,
        icon: Briefcase,
      },
      {
        title: "Sản phẩm",
        url: AppRoutes.dashboard.products.index.url,
        icon: Box,
      }
    );
  }

  if (user?.shopId && isOwner) {
    itemGroups.shop.items.push(
      {
        title: "Nhân viên",
        url: AppRoutes.dashboard.users.url,
        icon: Users,
      },
      {
        title: "Sản phẩm",
        url: AppRoutes.dashboard.products.index.url,
        icon: Box,
      },
      {
        title: "Yêu cầu",
        url: AppRoutes.dashboard.requests.index.url,
        icon: MessageSquarePlus ,
      },
      {
        title: "Nhập/Xuất",
        icon: ShoppingBasket,
        children: [
          {
            title: "Phiếu nhập",
            url: AppRoutes.dashboard.receipts.index.url,
          },
          {
            title: "Đơn hàng",
            url: AppRoutes.dashboard.orders.index.url,
          },
        ],
      },
      {
        title: "Hóa đơn",
        url: AppRoutes.dashboard.invoices.index.url,
        icon: BadgeCent,
      },
      {
        title: "Kho hàng",
        icon: Warehouse,
        children: [
          {
            title: "Kho",
            url: AppRoutes.dashboard.warehouses.facilities.index.url,
          },
          {
            title: "Hàng hóa",
            url: AppRoutes.dashboard.warehouses.inventories.index.url,
          },
        ],
      }
    );
    itemGroups.setting.items.push({
      title: "Cửa hàng",
      url: AppRoutes.dashboard.setting.shop.url,
      icon: ShoppingBag,
    }
  );
  }

  if (user?.shopId && isStaff) {
    itemGroups.shop.items.push({
      title: "Đơn hàng",
      icon: ShoppingBasket,
      children: [
        {
          title: "Phiếu nhập",
          url: AppRoutes.dashboard.receipts.index.url,
        },
        {
          title: "Đơn hàng",
          url: AppRoutes.dashboard.orders.index.url,
        },
      ],
    },
    {
      title: "Sản phẩm",
      url: AppRoutes.dashboard.products.index.url,
      icon: Box,
    },
    {
      title: "Yêu cầu",
      url: AppRoutes.dashboard.requests.index.url,
      icon: MessageSquarePlus ,
    },
  );
  }

  const groups = Object.keys(itemGroups).map(
    (key) => itemGroups[key as keyof typeof itemGroups]
  );

  return (
    <SidebarContent>
      {groups.map((group) => {
        if (group.items.length === 0) {
          return null;
        }

        return (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  if (item.url) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url} prefetch>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }

                  if (item.children && item.children.length > 0) {
                    return (
                      <Collapsible defaultOpen key={item.title}>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            {item.children.map((child) => {
                              return (
                                <SidebarMenuSub key={child.title}>
                                  <SidebarMenuSubItem>
                                    <SidebarMenuButton asChild>
                                      <Link href={child.url as string} prefetch>
                                        <span>{child.title}</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuSubItem>
                                </SidebarMenuSub>
                              );
                            })}
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </SidebarContent>
  );
};

export default Content;
