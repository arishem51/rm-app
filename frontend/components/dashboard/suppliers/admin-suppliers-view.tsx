"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiQuery } from "@/services/query";
import { Fragment, useCallback, useState } from "react";
import useAppQuery from "@/hooks/use-app-query";
import EmptyState from "../empty-state";
import { UserPen } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SupplierDTO } from "@/types/Api";
import HeaderListSearch from "../header-list-search";
import CreateSuppliersModal from "./create-suppliers-modal";
import SuppliersUpdateModal from "./update-suppliers-modal";
import UserPagination from "../users/pagination";

const AdminSuppliersView = () => {
  const createFilterValue = useCallback(
    (page: number, search: string) => ({
      page,
      search,
    }),
    []
  );
  const [updatedSupplier, setUpdatedSupplier] = useState<SupplierDTO>();
  const [filter, setFilter] = useState(createFilterValue(0, ""));

  const { data: { data } = {} } = useAppQuery(
    ApiQuery.suppliers.getSuppliers(filter)
  );

  const handleNavigatePage = (page: number) => {
    setFilter((prev) => createFilterValue(prev.page + page, prev.search));
  };
  const handleNavigateFullPage = (page: number) => {
    const isRight = page > 0;
    setFilter(
      createFilterValue(
        isRight ? (data?.totalPages ?? 0) - 1 : 0,
        filter.search
      )
    );
  };

  const handleSearch = (search: string) => {
    setFilter(createFilterValue(0, search));
  };

  return (
    <Fragment>
      <CreateSuppliersModal >
        <HeaderListSearch
          filterSearch={filter.search}
          onSearch={handleSearch}
        />
      </CreateSuppliersModal>
      <SuppliersUpdateModal  supplier={updatedSupplier}>
        {(data?.data?.length || 0) > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Tax code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((supplier) => {
                return (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contactName}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>{supplier.taxId}</TableCell>
                    <TableCell>{supplier.description}</TableCell>
                    <TableCell>{supplier.website}</TableCell>
                    <TableCell className="flex justify-end w-full">
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          className="w-6 h-6"
                          variant="outline"
                          onClick={() => {
                            setUpdatedSupplier(supplier);
                          }}
                        >
                          <UserPen />
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState />
        )}
        <UserPagination
          isLeftButtonDisabled={filter.page === 0}
          isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
          handleNavigateFullPage={handleNavigateFullPage}
          handleNavigatePage={handleNavigatePage}
        />
      </SuppliersUpdateModal>
    </Fragment>
  );
};

export default AdminSuppliersView;
