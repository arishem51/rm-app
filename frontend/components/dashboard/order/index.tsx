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
import { OrderResponseDTO } from "@/types/Api";
import Link from "next/link";
import { authAtom } from "@/store/auth";
import { globalStore } from '@/store';




//FIXME: fix orders page
const Orders = () => {
  const [filter, setFilter] = useState({ page: 0, search: "", createdAt: "" });
  const { data } = useAppQuery(ApiQuery.orders.getAllOrders());
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data?.data?.filter((order: OrderResponseDTO) =>
      order?.partnerName?.toLowerCase().includes(filter.search.toLowerCase())
    );
  }, [data, filter.search]);

  const paginatedData = useMemo(() => {
    const start = filter.page * itemsPerPage;
    return filteredData?.slice(start, start + itemsPerPage);
  }, [filteredData, filter.page]);

  const totalPages = Math.ceil((filteredData?.length ?? 0) / itemsPerPage);

  const handleSearch = (search: string) => {
    setFilter({ ...filter, page: 0, search });
  };

  const handleNavigateFullPage = (page: number) => {
    setFilter({
      page: page > 0 ? totalPages - 1 : 0,
      search: filter.search,
      createdAt: filter.createdAt,
    });
  };

  const handleNavigatePage = (page: number) => {
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
        <Link href="/dashboard/orders/create" prefetch>
          <Button>
            <Plus />
            Tạo đơn hàng
          </Button>
        </Link>
      </div>
      {(paginatedData?.length ?? 0) > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên người tạo</TableHead>
              <TableHead>Tên đối tác</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.partnerName}</TableCell>
                <TableCell>{order.partnerPhone}</TableCell>
                <TableCell>{order.totalAmount?.toLocaleString()} VND</TableCell>
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>{order.updatedAt || "Chưa cập nhật"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const token = globalStore.get(authAtom)?.token;
                        if (!token) {
                          alert("Vui lòng đăng nhập lại!");
                          return;
                        }

                        try {
                          const res = await fetch(`http://localhost:8080/api/orders/${order.id}/export-pdf`, {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });

                          if (!res.ok) {
                            throw new Error("Export thất bại. Kiểm tra lại quyền truy cập.");
                          }

                          const blob = await res.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `order_${order.id}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error(err);
                          alert("Lỗi khi tải file PDF!");
                        }
                      }}
                    >
                      Export PDF
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

export default Orders;
