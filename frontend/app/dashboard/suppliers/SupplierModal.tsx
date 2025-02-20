import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Supplier } from "./types";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  editingSupplier?: Supplier | null;
}

export function SupplierModal({
  isOpen,
  onClose,
  onSave,
  editingSupplier,
}: SupplierModalProps) {
  const [supplier, setSupplier] = useState<Supplier>({
    id: 0,
    name: "",
    contact: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (editingSupplier) setSupplier(editingSupplier);
  }, [editingSupplier]);

  const handleSave = () => {
    onSave(supplier);
    setSupplier({ id: 0, name: "", contact: "", address: "", phone: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <h2 className="text-xl font-bold mb-4">
        {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
      </h2>
      <input
        type="text"
        placeholder="Supplier Name"
        className="border p-2 w-full mb-2"
        value={supplier.name}
        onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Contact Email"
        className="border p-2 w-full mb-2"
        value={supplier.contact}
        onChange={(e) => setSupplier({ ...supplier, contact: e.target.value })}
      />
      <input
        type="text"
        placeholder="Address"
        className="border p-2 w-full mb-2"
        value={supplier.address}
        onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone Number"
        className="border p-2 w-full mb-2"
        value={supplier.phone}
        onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
      />
      <Button onClick={handleSave}>
        {editingSupplier ? "Update" : "Save"}
      </Button>
    </Dialog>
  );
}
