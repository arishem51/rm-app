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
import { Fragment, useState } from "react";
import { Badge } from "@/components/ui/badge";
import useAppQuery from "@/hooks/use-app-query";
import EmptyState from "../../empty-state";
import { UserPen } from "lucide-react";
import UserUpdateModal from "../update-user-modal";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserDTO } from "@/types/Api";
import CreateUserModal from "../create-user-modal";
import DeleteUserView from "./delete-user-view";
import HeaderListSearch from "../../header-list-search";
import { useMe } from "@/hooks/mutations/user";

const ProtectedUserOwnerView = () => {
  const [filter, setFilter] = useState({ search: "" });
  const [updatedUser, setUpdatedUser] = useState<UserDTO>();
  const { data: currentUser } = useMe();

  const { data: { data } = {} } = useAppQuery({
    ...ApiQuery.shops.getShopDetails(currentUser?.shopId),
    enabled: !!currentUser?.shopId,
  });

  const handleSearch = (search: string) => {
    setFilter({ search });
  };
  const users = data?.users || [];

  return (
    <Fragment>
      <CreateUserModal>
        <HeaderListSearch
          filterSearch={filter.search}
          onSearch={handleSearch}
        />
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
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => {
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
                    <TableCell>{startCase(lowerCase(user.role))}</TableCell>
                    <TableCell className="flex justify-end w-full">
                      {!isCurrentAccount && (
                        <Fragment>
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
                          <DeleteUserView user={user} />
                        </Fragment>
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
      </UserUpdateModal>
    </Fragment>
  );
};

export default ProtectedUserOwnerView;
