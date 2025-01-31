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
import UserSearch from "./user-search";
import { useCallback, useState } from "react";
import UserPagination from "./pagination";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Users = () => {
  const createFilterValue = useCallback(
    (page: number, search: string) => ({
      page,
      search,
    }),
    []
  );

  const [filter, setFilter] = useState(createFilterValue(0, ""));
  const { data: { data } = {} } = useQuery(ApiQuery.users.getUsers(filter));
  const userAtom = useUserAtomValue();
  const isAdmin = userAtom.user?.role === "ADMIN";

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
    <div className="mt-4">
      <div>
        <UserSearch filterSearch={filter.search} onSearch={handleSearch} />
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
            const isActive = user.status === "ACTIVE";
            const isCurrentAccount = userAtom.user?.id === user.id;

            return (
              <TableRow key={user.id}>
                <TableCell>
                  {user.name}{" "}
                  {isCurrentAccount && (
                    <Badge className=" text-xs p-[4px] ml-0.5">Current</Badge>
                  )}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{startCase(lowerCase(user.role))}</TableCell>
                {isAdmin && (
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
                )}
                <TableCell className="flex justify-end w-full">
                  {!isCurrentAccount && (
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
                  )}
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
