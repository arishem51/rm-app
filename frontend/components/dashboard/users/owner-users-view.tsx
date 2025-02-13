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
import { useUserAtomValue } from "@/store/user";
import { lowerCase, startCase } from "lodash";
import { Fragment, useState } from "react";
import { Badge } from "@/components/ui/badge";
import useAppQuery from "@/hooks/use-app-query";
import UsersEmptyState from "./empty-state";
import { UserPen } from "lucide-react";
import UserUpdateModal from "./update-user-modal";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserDTO } from "@/types/Api";
import CreateUserModal from "./create-user-modal";
import UserSearch from "./user-search";
import { cn } from "@/lib/utils";

const OwnerUsersView = () => {
  const [filter, setFilter] = useState({ search: "" });
  const [updatedUser, setUpdatedUser] = useState<UserDTO>();
  const userAtom = useUserAtomValue();
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.shops.getShopDetails(userAtom.user?.shopId)
  );
  const handleSearch = (search: string) => {
    setFilter({ search });
  };
  const users = data?.users || [];

  return (
    <Fragment>
      <CreateUserModal>
        <UserSearch filterSearch={filter.search} onSearch={handleSearch} />
      </CreateUserModal>
      <UserUpdateModal user={updatedUser}>
        {(users?.length || 0) > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Phone number</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => {
                const isActive = user.status === "ACTIVE";
                const isCurrentAccount = userAtom.user?.id === user.id;

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
          <UsersEmptyState />
        )}
      </UserUpdateModal>
    </Fragment>
  );
};

export default OwnerUsersView;
