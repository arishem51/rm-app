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
import HeaderListSearch from "../search/header-list-search";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createSttNumber } from "@/lib/utils";
import ListPagination from "../pagination";
import { generateReceiptCode } from "@/lib/helpers";
import { format } from "date-fns";
import ReceiptItems from "./receipt-items";
import PackagingTooltip from "../inventories/packaging-tooltip";

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
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>
                <PackagingTooltip />
              </TableHead>
              <TableHead>Khu vực</TableHead>
              <TableHead>Ngày nhập</TableHead>
              <TableHead>Người nhập</TableHead>
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
                  <ReceiptItems
                    items={item.receiptItems}
                    renderItemLabel={(item) => item.productName}
                  />
                </TableCell>
                <TableCell>
                  <ReceiptItems
                    items={item.receiptItems}
                    renderItemLabel={(item) => item.quantity + " bao"}
                  />
                </TableCell>
                <TableCell>
                  <ReceiptItems
                    items={item.receiptItems}
                    renderItemLabel={(item) => item.packageValue + " kg/bao"}
                  />
                </TableCell>
                <TableCell>
                  <ReceiptItems
                    items={item.receiptItems}
                    renderItemLabel={(item) =>
                      `${item.warehouseName} - ${item.zoneName}`
                    }
                  />
                </TableCell>
                <TableCell>
                  {format(item.createdAt ?? new Date(), "yyyy-MM-dd hh:mm")}
                </TableCell>
                <TableCell>{item.createdBy?.username}</TableCell>
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
