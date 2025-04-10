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
import React, { Fragment, useCallback, useState } from "react";
import useAppQuery from "@/hooks/use-app-query";
import EmptyState from "../empty-state";
import { UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderListSearch from "../search/header-list-search";
import UserPagination from "../../dashboard/pagination";
import DebtDetailsDialog from "@/components/dashboard/partner/debt-details-dialog";
import CreateDebtDetailDialog from "@/components/dashboard/partner/create-debt-detail-dialog";
import { DialogTrigger } from "@/components/ui/dialog";

const AdminPartnersView = () => {
  const createFilterValue = useCallback(
    (page: number, search: string) => ({
      page,
      pageSize: 10,
      search,
    }),
    []
  );
  const [filter, setFilter] = useState(createFilterValue(0, ""));

  const { data, refetch } = useAppQuery(ApiQuery.partners.getPartners(filter));

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
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  const handleSearch = () => {};

  return (
    <Fragment>
      <HeaderListSearch filterSearch={filter.search} onSearch={handleSearch} />
      {(partners.length || 0) > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Total Debt Amount</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => {
              return (
                <TableRow key={partner.id}>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.contactName}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.address}</TableCell>
                  <TableCell>{partner.description}</TableCell>
                  <TableCell>
                    {formatCurrency(partner.totalDebtAmount)}
                  </TableCell>
                  <TableCell>{partner.website}</TableCell>
                  <TableCell className="flex justify-end w-full">
                    <Button
                      size="icon"
                      className="w-6 h-6"
                      variant="outline"
                      onClick={() => {}}
                    >
                      <UserPen />
                    </Button>
                    <DebtDetailsDialog
                      partner={partner}
                      onDebtUpdated={refetch}
                    >
                      <Button variant="secondary" size="sm">
                        View Debt
                      </Button>
                    </DebtDetailsDialog>

                    <CreateDebtDetailDialog partnerId={partner.id!}>
                      <Button variant="outline" size="sm" className="ml-2">
                        Create Debt
                      </Button>
                    </CreateDebtDetailDialog>
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
