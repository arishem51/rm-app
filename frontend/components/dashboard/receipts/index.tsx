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
import { useMe } from "@/hooks/mutations/user";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createSttNumber } from "@/lib/utils";
import ListPagination from "../pagination";
import { checkRole } from "@/lib/helpers";
import { ReceiptResponseDTO } from "@/types/Api";
import { format } from "date-fns";

function generateReceiptCode(receipt: ReceiptResponseDTO) {
  const createdAt = new Date(receipt.createdAt ?? new Date());
  const year = createdAt.getFullYear();
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const day = String(createdAt.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;
  const idPart = String(receipt.id).padStart(5, "0");
  const prefix = "REC";
  return `${prefix}${datePart}${idPart}`;
}

const Receipts = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.receipts.getReceipts(filter)
  );
  const { data: currentUser } = useMe();

  const { isOwner } = checkRole(currentUser);
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
        {isOwner && (
          <Link href="/dashboard/receipts/create">
            <Button>
              <Plus />
              Tạo phiếu nhập
            </Button>
          </Link>
        )}
      </div>
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Mã phiếu</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Số lượng sản phẩm đã nhập</TableHead>
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
                <TableCell>{item.receiptItems?.length}</TableCell>
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
                  <Link href={`/dashboard/receipts/${item.id}`}>
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
