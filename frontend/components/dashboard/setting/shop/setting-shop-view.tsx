"use client";

import ShopForm from "@/components/shop-form";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { UserDTO } from "@/types/Api";

type Props = {
  user: UserDTO;
};

const SettingShopView = ({ user }: Props) => {
  const { data } = useAppQuery(ApiQuery.shops.getShopDetails(user.shopId));
  const { data: shopDetails } = data ?? {};

  return (
    <div className="w-1/2">
      <ShopForm shop={shopDetails} />
    </div>
  );
};

export default SettingShopView;
