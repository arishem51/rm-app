import { Skeleton } from "@/components/ui/skeleton";
import { range } from "lodash";

const UsersLoading = () => {
  return (
    <div className="mt-4">
      <div className="flex gap-2 h-9">
        <Skeleton className="h-9 mt-2 flex-1" />
        <Skeleton className="h-9 mt-2 flex-1 invisible" />
        <Skeleton className="h-9 mt-2 flex-1 invisible" />
      </div>
      {range(1, 6).map((item) => {
        return (
          <div key={item} className="flex gap-2 h-9 mt-2">
            <Skeleton className="h-9 mt-2 flex-1" />
            {item % 2 === 0 && <Skeleton className="h-9 mt-2 flex-1" />}
          </div>
        );
      })}
    </div>
  );
};

export default UsersLoading;
