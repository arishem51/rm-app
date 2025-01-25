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
import { useSuspenseQuery } from "@tanstack/react-query";
import { lowerCase, range, startCase } from "lodash";
import { Ellipsis, Trash, UserPen } from "lucide-react";
import UserSearch from "./UserSearch";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const Users = () => {
  const [filter, setFilter] = useState({
    page: 0,
  });
  const { data: { data } = {} } = useSuspenseQuery(
    ApiQuery.users.getUsers(filter)
  );
  const user = useUserAtomValue();
  const isAdmin = user.user?.role === "ADMIN";

  return (
    <div className="mt-4">
      <div>
        <UserSearch />
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
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={
                filter.page === 0 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {(data?.totalPages ?? 0) > 4 ? (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            range(1, (data?.totalPages ?? 0) + 1).map((index) => {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={filter.page === index - 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setFilter((prev) => ({ ...prev, page: index - 1 }));
                    }}
                  >
                    {index}
                  </PaginationLink>
                </PaginationItem>
              );
            })
          )}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Users;
