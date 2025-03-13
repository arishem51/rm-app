import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import { ApiQuery } from "@/services/query";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export default async function Layout({ children }: Props) {
  return (
    <HydrationPrefetchQuery
      queries={[
        ApiQuery.products.getAllProducts(),
        ApiQuery.zones.getAllByShop(),
      ]}
    >
      {children}
    </HydrationPrefetchQuery>
  );
}
