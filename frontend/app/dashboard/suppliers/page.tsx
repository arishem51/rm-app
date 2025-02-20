import SupplierTable from "./table";
import SupplierForm from "./form";

export default function SupplierPage() {
  return (
    <div className="container">
      <h2>Supplier Management</h2>
      <SupplierForm />
      <SupplierTable />
    </div>
  );
}
