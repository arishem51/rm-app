import ProtectedShop from "@/components/protected-shop";

const InventoriesPage = () => {
  return (
    <ProtectedShop fallback={{ redirectPath: "/dashboard" }}>
      <div>Inventory</div>
    </ProtectedShop>
  );
};

export default InventoriesPage;
