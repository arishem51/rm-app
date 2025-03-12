import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAppQuery from "@/hooks/use-app-query";
import { toCurrency } from "@/lib/utils";
import { ApiQuery } from "@/services/query";

export function RecentOrders() {
  const { data = {} } = useAppQuery(ApiQuery.statistics.getRecentOrders());
  const { data: recentOrders } = data;

  return (
    <div className="space-y-8">
      {recentOrders?.map((item, index) => {
        return (
          <div key={index} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>
                {item.userName?.[0]}
                {item.userName?.[1]}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {item.userName}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +{toCurrency(item.totalAmount ?? 0)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
