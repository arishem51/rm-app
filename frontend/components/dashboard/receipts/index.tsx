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
import { ArrowUpRight, Plus } from "lucide-react";
import { Fragment, useState } from "react";
import EmptyState from "../empty-state";
import HeaderListSearch from "../header-list-search";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createSttNumber, toCurrency } from "@/lib/utils";
import ListPagination from "../pagination";
import { generateReceiptCode } from "@/lib/helpers";
import { format } from "date-fns";
import { ReceiptItemResponseDTO } from "@/types/Api";

const Receipts = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.receipts.getReceipts(filter)
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

  const renderReceiptItems = (items?: ReceiptItemResponseDTO[]) => {
    return (
      <div className="flex flex-col">
        {items?.slice(0, 2).map((item) => (
          <div key={item.id} className="flex items-center">
            <div className="text-sm w-48 overflow-hidden text-ellipsis whitespace-nowrap">
              {item.productName} - {toCurrency(item.productPrice ?? 0)} -{" "}
              {item.quantity} bao
            </div>
          </div>
        ))}
        {(items?.length ?? 0) > 2 && <div>...</div>}
      </div>
    );
  };

  return (
    <Fragment>
      <div className="flex justify-between">
        <HeaderListSearch
          filterSearch={filter.search}
          onSearch={handleSearch}
        />
        <Link href="/dashboard/receipts/create" prefetch>
          <Button>
            <Plus />
            Tạo phiếu nhập
          </Button>
        </Link>
      </div>
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Mã phiếu</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Sản phẩm đã nhập</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{createSttNumber(index, filter.page)}</TableCell>
                <TableCell>{generateReceiptCode(item)}</TableCell>
                <TableCell>
                  {format(item.createdAt ?? new Date(), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>{renderReceiptItems(item.receiptItems)}</TableCell>
                <TableCell>
                  <Badge
                    className="px-1 py-0.5"
                    variant={
                      item?.status === "FAILED" ? "destructive" : "default"
                    }
                  >
                    {item.status === "FAILED" ? "Thất bại" : "Thành công"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/receipts/${item.id}`} prefetch>
                    <Button variant="outline" className="w-6 h-6" size="icon">
                      <ArrowUpRight />
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

export default Receipts;
