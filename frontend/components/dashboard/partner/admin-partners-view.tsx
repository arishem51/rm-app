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
import { Fragment, useState } from "react";
import useAppQuery from "@/hooks/use-app-query";
import EmptyState from "../empty-state";
import { Plus, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderListSearch from "../search/header-list-search";
import UserPagination from "../../dashboard/pagination";
import Link from "next/link";
import { createSttNumber } from "@/lib/utils";

const AdminPartnersView = () => {
  const [filter, setFilter] = useState({ page: 0 });
  const { data } = useAppQuery(ApiQuery.partners.getPartners(filter));

  const pageData = data?.data;
  const partners = pageData?.data || [];

  const handleNavigatePage = (page: number) => {
    setFilter((prev) => ({
      ...prev,
      page: prev.page + page,
    }));
  };
  const handleNavigateFullPage = (page: number) => {
    const isRight = page > 0;
    setFilter((prev) => ({
      ...prev,
      page: isRight ? (pageData?.totalPages ?? 0) - 1 : 0,
    }));
  };

  const handleSearch = () => {};

  return (
    <Fragment>
      <div className="flex justify-between items-center">
        <HeaderListSearch filterSearch="" onSearch={handleSearch} />
        <Button asChild>
          <Link href="/dashboard/partners/create">
            <Plus className="mr-1" />
            <span>Tạo đối tác</span>
          </Link>
        </Button>
      </div>
      {(partners.length || 0) > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Tên người đại diện</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead className="text-right">Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner, index) => {
              return (
                <TableRow key={partner.id}>
                  <TableCell>{createSttNumber(index, filter.page)}</TableCell>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.contactName}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.address}</TableCell>
                  <TableCell className="flex justify-end w-full">
                    <Button
                      size="icon"
                      className="w-6 h-6"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/dashboard/partners/${partner.id}`}>
                        <UserPen />
                      </Link>
                    </Button>
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
        isRightButtonDisabled={filter.page >= (pageData?.totalPages ?? 0) - 1}
        handleNavigateFullPage={handleNavigateFullPage}
        handleNavigatePage={handleNavigatePage}
      />
    </Fragment>
  );
};

export default AdminPartnersView;
