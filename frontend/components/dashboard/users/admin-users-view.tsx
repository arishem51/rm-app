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
import { lowerCase, startCase } from "lodash";
import { Fragment, useCallback, useState } from "react";
import UserPagination from "./pagination";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useAppQuery from "@/hooks/use-app-query";
import EmptyState from "../empty-state";
import { UserPen } from "lucide-react";
import UserUpdateModal from "./update-user-modal";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserDTO } from "@/types/Api";
import CreateUserModal from "./create-user-modal";
import HeaderListSearch from "../header-list-search";
import { useMe } from "@/hooks/mutations/user";

const AdminUsersView = () => {
  const createFilterValue = useCallback(
    (page: number, search: string) => ({
      page,
      search,
    }),
    []
  );
  const [updatedUser, setUpdatedUser] = useState<UserDTO>();
  const [filter, setFilter] = useState(createFilterValue(0, ""));

  const { data: currentUser } = useMe();
  const { data: { data } = {} } = useAppQuery(ApiQuery.users.getUsers(filter));

  const handleNavigatePage = (page: number) => {
    setFilter((prev) => createFilterValue(prev.page + page, prev.search));
  };
  const handleNavigateFullPage = (page: number) => {
    const isRight = page > 0;
    setFilter(
      createFilterValue(
        isRight ? (data?.totalPages ?? 0) - 1 : 0,
        filter.search
      )
    );
  };

  const handleSearch = (search: string) => {
    setFilter(createFilterValue(0, search));
  };

  return (
    <Fragment>
      <CreateUserModal isAdmin>
        <HeaderListSearch
          filterSearch={filter.search}
          onSearch={handleSearch}
        />
      </CreateUserModal>
      <UserUpdateModal isAdmin user={updatedUser}>
        {(data?.data?.length || 0) > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Phone number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((user) => {
                const isActive = user.status === "ACTIVE";
                const isCurrentAccount = currentUser?.id === user.id;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.name}{" "}
                      {isCurrentAccount && (
                        <Badge className=" text-xs p-[4px] py-0 ml-0.5">
                          Current
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{startCase(lowerCase(user.role))}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          isActive
                            ? "bg-green-600 hover:bg-green-500 text-slate-100"
                            : ""
                        )}
                        variant={isActive ? "default" : "destructive"}
                      >
                        {startCase(lowerCase(user.status))}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-end w-full">
                      {!isCurrentAccount && (
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            className="w-6 h-6"
                            variant="outline"
                            onClick={() => {
                              setUpdatedUser(user);
                            }}
                          >
                            <UserPen />
                          </Button>
                        </DialogTrigger>
                      )}
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
          isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
          handleNavigateFullPage={handleNavigateFullPage}
          handleNavigatePage={handleNavigatePage}
        />
      </UserUpdateModal>
    </Fragment>
  );
};

export default AdminUsersView;
