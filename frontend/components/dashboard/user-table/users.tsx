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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiQuery } from "@/services/query";
import { useUserAtomValue } from "@/store/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import { lowerCase, startCase } from "lodash";
import { Ellipsis, Trash, UserPen } from "lucide-react";

const Users = () => {
  const { data } = useSuspenseQuery(ApiQuery.users.getUsers());
  const user = useUserAtomValue();
  const isAdmin = user.user?.role === "ADMIN";

  return (
    <Table className="mt-4">
      <TableCaption>List users</TableCaption>
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
        {data?.data?.data?.map((user) => {
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
  );
};

export default Users;
