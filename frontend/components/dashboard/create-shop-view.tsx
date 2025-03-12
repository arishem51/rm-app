import ShopModal from "./shops/shop-modal";

const CreateShopView = () => {
  return (
    <div className="flex items-center flex-col gap-2 mt-4">
      <h1>Bạn chưa có cửa hàng nào, hãy tạo một cửa hàng</h1>
      <ShopModal />
    </div>
  );
};

export default CreateShopView;
