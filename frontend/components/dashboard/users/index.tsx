"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiQuery } from "@/services/query";
import { useUserAtomValue } from "@/store/user";
import { useQuery } from "@tanstack/react-query";
import { lowerCase, startCase } from "lodash";
import { Ellipsis, Trash, UserPen } from "lucide-react";
import UserSearch from "./UserSearch";
import { useState } from "react";
import UserPagination from "./pagination";

const Users = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useQuery(ApiQuery.users.getUsers(filter));
  const user = useUserAtomValue();
  const isAdmin = user.user?.role === "ADMIN";

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

  const handleSearch = (search: string) => {
    setFilter({ page: 0, search });
  };

  return (
    <div className="mt-4">
      <div>
        <UserSearch onSearch={handleSearch} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead>Role</TableHead>
            {isAdmin && <TableHead>Status</TableHead>}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{startCase(lowerCase(user.role))}</TableCell>
                {isAdmin && <TableCell>--/--</TableCell>}
                <TableCell className="flex justify-end w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="cursor-pointer">
                        <UserPen />
                        <span>Update</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Trash />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <UserPagination
        isLeftButtonDisabled={filter.page === 0}
        isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
        handleNavigateFullPage={handleNavigateFullPage}
        handleNavigatePage={handleNavigatePage}
      />
    </div>
  );
};

export default Users;
