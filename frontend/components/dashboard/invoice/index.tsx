"use client";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import { Fragment, useState, useMemo } from "react";
import HeaderListSearch from "../search/header-list-search";

import EmptyState from "../empty-state";
import ListPagination from "../pagination";
import { PaymentHistoryResponseDTO } from "@/types/Api";
import { useRouter } from "next/navigation";

const Payment = () => {
  const [filter, setFilter] = useState({ page: 0, search: "", createdAt: "" });
  const { data } = useAppQuery(ApiQuery.payment.getAllPayment());
  const itemsPerPage = 5;
  const router = useRouter();
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data?.data.filter((payment: PaymentHistoryResponseDTO) =>
      payment?.partnerName.toLowerCase().includes(filter.search.toLowerCase())
    );
  }, [data, filter.search]);

  const paginatedData = useMemo(() => {
    const start = filter.page * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, filter.page]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearch = (search) => {
    setFilter({ ...filter, page: 0, search });
  };

  const handleNavigateFullPage = (page) => {
    setFilter({
      page: page > 0 ? totalPages - 1 : 0,
      search: filter.search,
      createdAt: filter.createdAt,
    });
  };

  const handleNavigatePage = (page) => {
    setFilter((prev) => ({ ...prev, page: prev.page + page }));
  };
  return (
    <Fragment>
      <div className="flex justify-between">
        <div className="flex w-full items-center">
          <HeaderListSearch
            filterSearch={filter.search}
            onSearch={handleSearch}
          />
        </div>
      </div>
      {paginatedData.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên đối tác</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Tiền Đơn Hàng</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Phí vận chuyển</TableHead>
              <TableHead>Tổng đơn hàng</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Loại Hóa Đơn</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.partnerName}</TableCell>
                <TableCell>{order.partnerPhone}</TableCell>
                <TableCell>{order.orderAmount?.toLocaleString()} VND</TableCell>
                <TableCell>{order.discount?.toLocaleString()} VND</TableCell>
                <TableCell>{order.shippingFee?.toLocaleString()} VND</TableCell>
                <TableCell>{order.totalAmount?.toLocaleString()} VND</TableCell>
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>{order.debt ? "Phiếu nợ" : "Hoàn thành"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/invoice/${order.id}`)
                      }
                      size="sm"
                      variant="secondary"
                    >
                      Xem
                    </Button>
                  </div>
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
        isRightButtonDisabled={filter.page >= totalPages - 1}
        handleNavigateFullPage={handleNavigateFullPage}
        handleNavigatePage={handleNavigatePage}
      />
    </Fragment>
  );
};

export default Payment;
