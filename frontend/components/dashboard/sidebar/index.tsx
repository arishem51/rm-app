import { Sidebar } from "@/components/ui/sidebar";
import Footer from "./footer";

import SidebarHeader from "./header";
import Content from "./content";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <Content />
      <Footer />
    </Sidebar>
  );
}
