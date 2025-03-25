import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search, XIcon } from "lucide-react";
import { useState } from "react";

type Item = {
  filterSearch?: string;
  name: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & { label?: string };
};

type InputSearchProps = {
  setSearch: (search: string) => void;
  search: string;
} & Item;

type Props = {
  items: Item[];
  onSearchClick: (items: { search: string; name: string }[]) => void;
};

const InputSearch = ({
  setSearch,
  search,
  filterSearch,
  inputProps,
}: InputSearchProps) => {
  const resetSearch = () => {
    setSearch("");
  };

  return (
    <div className="mt-2">
      <Label>{inputProps?.label}</Label>
      <div className="relative">
        <div className="flex gap-1">
          <Input
            {...inputProps}
            placeholder={inputProps?.placeholder}
            value={!!search ? search : ""}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onBlur={() => {
              if (filterSearch && !search) {
                setSearch(filterSearch);
              }
            }}
          />
        </div>
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
    </div>
  );
};

const MultiHeaderListSearch = ({ items, onSearchClick }: Props) => {
  const [searchOptions, setSearchOptions] = useState<{
    [name: string]: string;
  }>(items.reduce((acc, item) => ({ ...acc, [item.name]: "" }), {}));

  return (
    <div className="flex items-center gap-2 w-1/2 my-2">
      {items.map((item, index) => {
        const setSearch = (search: string) => {
          setSearchOptions((prev) => ({ ...prev, [item.name]: search }));
        };
        return (
          <InputSearch
            key={index}
            {...item}
            setSearch={setSearch}
            search={searchOptions[item.name]}
          />
        );
      })}
      <Button
        size="icon"
        className="flex-shrink-0 self-end"
        onClick={() => {
          onSearchClick(
            Object.entries(searchOptions).map(([name, search]) => ({
              name,
              search,
            }))
          );
        }}
      >
        <Search />
      </Button>
    </div>
  );
};

export default MultiHeaderListSearch;
