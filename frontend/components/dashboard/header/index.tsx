import { Separator } from "../../ui/separator";
import { SidebarTrigger } from "../../ui/sidebar";
import Navbar from "./navbar";

const Header = () => {
  return (
    <div className="px-3 py-4 flex items-center gap-3">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-[20px]" />
      <Navbar />
    </div>
  );
};

export default Header;
