import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AppRoutes } from "@/lib/constants";
import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <SidebarHeader className="pb-0">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-auto">
                <div className="flex items-center justify-center p-2 bg-blue-700 rounded-lg overflow-hidden">
                  <GalleryVerticalEnd size={16} />
                </div>
                <div>Không gian làm việc</div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              <DropdownMenuItem disabled>
                <span>Bảng điều khiển</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SquareArrowOutUpRight />
                <Link href={AppRoutes.home.url} className="w-full">
                  Trang giới thiệu
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default Header;
