"use client";

import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { ArrowUpRight } from "lucide-react";
import { Fragment, useState } from "react";
import EmptyState from "../empty-state";
import HeaderListSearch from "../header-list-search";
import { useMe } from "@/hooks/mutations/user";
import { UserRole } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Products = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.products.getProducts(filter)
  );
  const { data: currentUser } = useMe();

  const isOwner = currentUser?.role === UserRole.OWNER;
  const handleSearch = (search: string) => {
    setFilter({ page: 0, search });
  };

  return (
    <Fragment>
      <HeaderListSearch filterSearch={filter.search} onSearch={handleSearch} />
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={product.category?.name ? "default" : "outline"}
                    className="px-1 py-0.5"
                  >
                    {product.category?.name || "None"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.supplier?.name ? "default" : "outline"}
                    className="px-1 py-0.5"
                  >
                    {product.supplier?.name || "None"}
                  </Badge>
                </TableCell>
                <TableCell>{product.shopName}</TableCell>
                <TableCell className="text-right">
                  {isOwner ? (
                    <Link href={`/dashboard/products/${product.id}`}>
                      <Button variant="outline" className="w-6 h-6" size="icon">
                        <ArrowUpRight />
                      </Button>
                    </Link>
                  ) : (
                    <Badge className="px-1 py-0.5" variant="outline">
                      No Action
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState />
      )}
    </Fragment>
  );
};

export default Products;
