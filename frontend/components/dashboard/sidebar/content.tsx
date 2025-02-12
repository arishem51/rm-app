"use client";

import {
  ChevronsUpDown,
  Home,
  LucideIcon,
  Store,
  User2,
  Users,
} from "lucide-react";
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
import { AppPathURL, UserRole } from "@/lib/constants";
import { useUserAtomValue } from "@/store/user";

type Item = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  children?: Item[];
};

type SidebarGroupType = "application" | "shop";

const Content = () => {
  const { user } = useUserAtomValue();
  const itemGroups: Record<
    SidebarGroupType,
    {
      title: string;
      items: Item[];
    }
  > = {
    application: {
      title: "Application",
      items: [
        {
          title: "Home",
          url: AppPathURL.dashboard.home,
          icon: Home,
        },
      ],
    },
    shop: {
      title: "Shop Management",
      items: [],
    },
  };

  if (user?.role === UserRole.ADMIN) {
    itemGroups.application.items.push(
      {
        title: "Users",
        icon: User2,
        url: AppPathURL.dashboard.users,
        children: [],
      },
      {
        title: "Shops",
        url: AppPathURL.dashboard.shops,
        icon: Store,
      }
    );
  }

  if (user?.role === UserRole.OWNER) {
    itemGroups.shop.items.push({
      title: "Users",
      url: AppPathURL.dashboard.users,
      icon: Users,
    });
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
                          <Link href={item.url}>
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
                                      <span>{child.title}</span>
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
