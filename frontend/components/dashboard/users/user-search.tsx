import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

type Props = {
  onSearch: (search: string) => void;
  filterSearch?: string;
};
const UserSearch = ({ onSearch, filterSearch }: Props) => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex items-center gap-2">
      <Input
        className="my-2 w-1/3"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onBlur={() => {
          if (filterSearch && filterSearch !== search) {
            setSearch(filterSearch);
          }
        }}
      />
      <Button
        size="icon"
        onClick={() => {
          onSearch(search);
        }}
      >
        <Search size={16} />
      </Button>
    </div>
  );
};

export default UserSearch;
