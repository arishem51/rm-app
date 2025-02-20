import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SupplierTable } from "./SupplierTable";
import { SupplierModal } from "./SupplierModal";
import { Supplier } from "./types";

const suppliersMock: Supplier[] = [
  {
    id: 1,
    name: "Supplier A",
    contact: "supplierA@example.com",
    address: "123 Street A",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Supplier B",
    contact: "supplierB@example.com",
    address: "456 Street B",
    phone: "987-654-3210",
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(suppliersMock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [search, setSearch] = useState("");

  const handleAddOrUpdateSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => {
      const exists = prev.find((s) => s.id === supplier.id);
      return exists
        ? prev.map((s) => (s.id === supplier.id ? supplier : s))
        : [...prev, { ...supplier, id: Date.now() }];
    });
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Suppliers</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search suppliers..."
          className="border p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => {
            setEditingSupplier(null);
            setIsModalOpen(true);
          }}
        >
          Add Supplier
        </Button>
      </div>
      <Card>
        <CardContent>
          <SupplierTable
            suppliers={filteredSuppliers}
            onEdit={setEditingSupplier}
            onDelete={handleDeleteSupplier}
          />
        </CardContent>
      </Card>
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddOrUpdateSupplier}
        editingSupplier={editingSupplier}
      />
    </div>
  );
}
