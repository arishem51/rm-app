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
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HeaderListSearch from "../header-list-search";
import CreatePartnersModal from "./create-partners-modal";
import Pagination from "../pagination";

const OwnerPartnersView = () => {
  const createFilterValue = useCallback(
    (page: number, search: string) => ({
      page,
      search,
    }),
    []
  );

  const [filter, setFilter] = useState(createFilterValue(0, ""));
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.partners.getPartners(filter)
  );

  const handleNavigatePage = (page: number) => {
    setFilter((prev) => createFilterValue(prev.page + page, prev.search));
  };

  const handleSearch = (search: string) => {
    setFilter(createFilterValue(0, search));
  };

  return (
    <Fragment>
      <CreatePartnersModal />
      <HeaderListSearch filterSearch={filter.search} onSearch={handleSearch} />
      {data?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>{partner.name}</TableCell>
                <TableCell>{partner.contactName}</TableCell>
                <TableCell>{partner.phone}</TableCell>
                <TableCell>{partner.email}</TableCell>
                <TableCell>{partner.address}</TableCell>
                <TableCell>{partner.description}</TableCell>
                <TableCell>{partner.website}</TableCell>
                <TableCell className="flex justify-end">
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        // Handle partner update
                      }}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState />
      )}
      <Pagination
        isLeftButtonDisabled={filter.page === 0}
        isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
        handleNavigatePage={handleNavigatePage}
      />
    </Fragment>
  );
};

export default OwnerPartnersView;