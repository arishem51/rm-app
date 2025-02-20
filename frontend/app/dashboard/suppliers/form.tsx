"use client";
import { useState } from "react";

export default function SupplierForm({ supplier = null, onSave }: any) {
  const [name, setName] = useState(supplier ? supplier.name : "");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({ id: supplier?.id, name });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Supplier name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        {supplier ? "Update" : "Add"}
      </button>
    </form>
  );
}
