import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  onSearch: (search: string) => void;
  filterSearch?: string;
};

const HeaderListSearch = ({ onSearch, filterSearch }: Props) => {
  const [search, setSearch] = useState("");
  const resetSearch = () => {
    setSearch("");
    onSearch("");
  };

  return (
    <div className="flex items-center gap-2 w-1/2">
      <div className="my-2 relative">
        <Input
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onBlur={() => {
            if (filterSearch && !search) {
              setSearch(filterSearch);
            }
          }}
        />
        <Button
          size="icon"
          className={cn(
            "rounded-full h-4 w-4 absolute right-2 top-[50%] transform -translate-y-1/2",
            search ? "block" : "hidden"
          )}
          variant="secondary"
          onClick={resetSearch}
        >
          <XIcon />
        </Button>
      </div>
      <Button
        size="icon"
        className="flex-shrink-0"
        onClick={() => {
          onSearch(search);
        }}
      >
        <Search />
      </Button>
    </div>
  );
};

export default HeaderListSearch;
