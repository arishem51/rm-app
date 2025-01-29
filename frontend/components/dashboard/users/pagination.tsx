import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type PaginationItemButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
};
const PaginationItemButton = ({
  onClick,
  disabled,
  children,
}: PaginationItemButtonProps) => {
  return (
    <PaginationItem>
      <Button
        size="icon"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
        className={disabled ? "pointer-events-none opacity-50" : ""}
      >
        {children}
      </Button>
    </PaginationItem>
  );
};

type Props = {
  isLeftButtonDisabled: boolean;
  isRightButtonDisabled: boolean;
  handleNavigatePage: (page: number) => void;
  handleNavigateFullPage: (page: number) => void;
};
const UserPagination = ({
  handleNavigateFullPage,
  handleNavigatePage,
  isLeftButtonDisabled,
  isRightButtonDisabled,
}: Props) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent className="gap-1">
        <PaginationItemButton
          onClick={() => handleNavigateFullPage(-1)}
          disabled={isLeftButtonDisabled}
        >
          <ChevronsLeft className="h-4 w-4" />
        </PaginationItemButton>
        <PaginationItemButton
          onClick={() => handleNavigatePage(-1)}
          disabled={isLeftButtonDisabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationItemButton>
        <PaginationItemButton
          onClick={() => handleNavigatePage(1)}
          disabled={isRightButtonDisabled}
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationItemButton>
        <PaginationItemButton
          onClick={() => handleNavigateFullPage(1)}
          disabled={isRightButtonDisabled}
        >
          <ChevronsRight className="h-4 w-4" />
        </PaginationItemButton>
      </PaginationContent>
    </Pagination>
  );
};

export default UserPagination;
