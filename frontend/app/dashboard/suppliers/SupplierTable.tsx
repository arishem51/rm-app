import { Supplier } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number) => void;
}

export function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
}: SupplierTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell>{supplier.id}</TableCell>
            <TableCell>{supplier.name}</TableCell>
            <TableCell>{supplier.contact}</TableCell>
            <TableCell>{supplier.address}</TableCell>
            <TableCell>{supplier.phone}</TableCell>
            <TableCell>
              <Button onClick={() => onEdit(supplier)}>Edit</Button>
              <Button onClick={() => onDelete(supplier.id)} className="ml-2">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
