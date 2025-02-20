"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await axios.get("/api/suppliers");
    setSuppliers(res.data);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/suppliers/${id}`);
    fetchSuppliers();
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Supplier Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier: any) => (
          <tr key={supplier.id}>
            <td>{supplier.id}</td>
            <td>{supplier.name}</td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(supplier.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
