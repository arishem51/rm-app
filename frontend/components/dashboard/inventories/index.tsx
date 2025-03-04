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
import { Edit } from "lucide-react";
import { Fragment, useState } from "react";
import EmptyState from "../empty-state";
import HeaderListSearch from "../header-list-search";
import Link from "next/link";
import ListPagination from "../pagination";

const Inventories = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.inventories.getInventories(filter)
  );

  const handleSearch = (search: string) => {
    setFilter({ page: 0, search });
  };
  const handleNavigatePage = (page: number) => {
    setFilter((prev) => ({ page: prev.page + page, search: prev.search }));
  };
  const handleNavigateFullPage = (page: number) => {
    const isRight = page > 0;
    setFilter({
      page: isRight ? (data?.totalPages ?? 0) - 1 : 0,
      search: filter.search,
    });
  };

  return (
    <Fragment>
      <div className="flex justify-between">
        <HeaderListSearch
          filterSearch={filter.search}
          onSearch={handleSearch}
        />
        {/* {isOwner && (
          <Link href="/dashboard/inventories/create">
            <Button>
              <Plus />
              Create Inventory
            </Button>
          </Link>
        )} */}
      </div>
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/products/${item.productId}`}
                    className="hover:underline"
                  >
                    {item.productName}
                  </Link>
                </TableCell>
                <TableCell>{item.warehouseName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/warehouses/inventories/${item.id}`}>
                    <Button variant="outline" className="w-6 h-6" size="icon">
                      <Edit />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState />
      )}
      <ListPagination
        isLeftButtonDisabled={filter.page === 0}
        isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
        handleNavigateFullPage={handleNavigateFullPage}
        handleNavigatePage={handleNavigatePage}
      />
    </Fragment>
  );
};

export default Inventories;
