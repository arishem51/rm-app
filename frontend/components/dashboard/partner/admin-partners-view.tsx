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
import { Partner } from "@/types/Api";
import HeaderListSearch from "../header-list-search";
import CreatePartnersModal from "./create-partners-modal";
import PartnersUpdateModal from "./update-partners-modal";
import UserPagination from "../../dashboard/pagination";

const AdminPartnersView = () => {
  const createFilterValue = useCallback(
    (page: number, search: string) => ({
      page,
      pageSize: 10,
      search,
    }),
    []
  );
  const [updatedPartner, setUpdatedPartner] = useState<Partner>();
  const [filter, setFilter] = useState(createFilterValue(0, ""));

  const { data } = useAppQuery(
    ApiQuery.partners.getPartners(filter)
  );

  const pageData = data?.data;
  const partners = pageData?.data || [];

  const handleNavigatePage = (page: number) => {
    setFilter((prev) => createFilterValue(prev.page + page, prev.search));
  };
  const handleNavigateFullPage = (page: number) => {
    const isRight = page > 0;
    setFilter(
      createFilterValue(
        isRight ? (pageData?.totalPages ?? 0) - 1 : 0,
        filter.search
      )
    );
  };

  const handleSearch = (search: string) => {
    setFilter(createFilterValue(0, search));
  };

  return (
    <Fragment>
      <CreatePartnersModal >
        <HeaderListSearch
          filterSearch={filter.search}
          onSearch={handleSearch}
        />
      </CreatePartnersModal>
      <PartnersUpdateModal partner={updatedPartner}>
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
                    <TableCell>{partner.website}</TableCell>
                    <TableCell className="flex justify-end w-full">
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          className="w-6 h-6"
                          variant="outline"
                          onClick={() => {
                            setUpdatedPartner(partner);
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
          isRightButtonDisabled={filter.page >= (pageData?.totalPages ?? 0) - 1}
          handleNavigateFullPage={handleNavigateFullPage}
          handleNavigatePage={handleNavigatePage}
        />
      </PartnersUpdateModal>
    </Fragment>
  );
};

export default AdminPartnersView;
