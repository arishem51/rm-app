"use client";

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
import { Fragment, useState } from "react";
import EmptyState from "../empty-state";
import HeaderListSearch from "../search/header-list-search";
import Link from "next/link";
import ListPagination from "../pagination";
import { toCurrency } from "@/lib/utils";
import { useMe } from "@/hooks/mutations/user";
import { checkRole } from "@/lib/helpers";
import PackagingTooltip from "./packaging-tooltip";

const Inventories = () => {
  const { data: currentUser } = useMe();
  const { isStaff } = checkRole(currentUser);
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
      </div>
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Giá niêm yết</TableHead>
              <TableHead>Số lượng bao</TableHead>
              <TableHead>
                <PackagingTooltip />
              </TableHead>
              <TableHead>Tên kho</TableHead>
              <TableHead>Khu vực trong kho</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {isStaff ? (
                    item.product?.name
                  ) : (
                    <Link
                      prefetch
                      href={`/dashboard/products/${item.product?.id}`}
                      className="hover:underline"
                    >
                      {item.product?.name}
                    </Link>
                  )}
                </TableCell>
                <TableCell>{toCurrency(+(item.product?.price || 0))}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.packageValue} kg/bao</TableCell>
                <TableCell>{item.warehouseName}</TableCell>
                <TableCell>{item.zoneName}</TableCell>
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
