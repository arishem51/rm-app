"use client";

import {
  TableHeader,
  TableRow,
  TableBody,
  Table,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Fragment, useState } from "react";
import HeaderListSearch from "../header-list-search";
import EmptyState from "../empty-state";
import ListPagination from "../pagination";

const Facilities = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.warehouses.getWarehouses(filter)
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
      <HeaderListSearch filterSearch={filter.search} onSearch={handleSearch} />
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((warehouse, index) => (
              <TableRow key={warehouse.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{warehouse.name}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>{warehouse.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState />
      )}
      {(data?.data?.length ?? 0) > 0 && (
        <ListPagination
          isLeftButtonDisabled={filter.page === 0}
          isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
          handleNavigateFullPage={handleNavigateFullPage}
          handleNavigatePage={handleNavigatePage}
        />
      )}
    </Fragment>
  );
};

export default Facilities;
