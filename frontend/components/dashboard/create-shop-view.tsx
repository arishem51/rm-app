"use client";
import ShopModal from "./shops/shop-modal";

const CreateShopView = () => {
  return (
    <div className="flex items-center flex-col gap-2 mt-4">
      <h1>
        You haven&apos;t register any shop yet, create a shop or join by an
        invite!
      </h1>
      <ShopModal />
    </div>
  );
};

export default CreateShopView;
