import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import SettingShopView from "@/components/dashboard/setting/shop/setting-shop-view";
import { Separator } from "@/components/ui/separator";
import { getMe } from "@/server/actions";
import { ApiQuery } from "@/services/query";
import { redirect } from "next/navigation";

const Page = async () => {
  const query = await getMe();
  const { data } = query ?? {};
  const { data: user } = data ?? {};

  if (!user?.shopId) {
    redirect("/dashboard");
  }

  return (
    <HydrationPrefetchQuery
      query={ApiQuery.shops.getShopDetails(user.shopId)}
      awaitQuery
    >
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Profile</h1>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
        <Separator className="my-4 w-1/2" />
        <SettingShopView user={user} />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Page;
