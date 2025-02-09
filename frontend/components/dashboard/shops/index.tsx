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
import { Fragment, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useAppQuery from "@/hooks/use-app-query";
import UsersEmptyState from "./empty-state";
import { UserPen } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shop, User } from "@/types/Api";
import UserPagination from "../users/pagination";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import ListUserModal from "./list-user-shop";
import UpdateShopModal from "./update-shop-modal";

const mockShops: Shop[] = [
  {
    id: 1,
    name: "Shop A",
    address: "123 Main Street, City A",
    users: [
      {
        id: 1,
        username: "john_doe",
        name: "John Doe",
        phoneNumber: "123-456-7890",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-15T12:00:00Z",
        role: "OWNER",
        status: "ACTIVE",
      },
      {
        id: 2,
        username: "jane_smith",
        name: "Jane Smith",
        phoneNumber: "234-567-8901",
        createdAt: "2024-02-01T12:00:00Z",
        updatedAt: "2024-02-05T12:00:00Z",
        role: "STAFF",
        status: "ACTIVE",
      },
    ],
  },
  {
    id: 2,
    name: "Shop B",
    address: "456 Second Avenue, City B",
    users: [
      {
        id: 3,
        username: "mike_johnson",
        name: "Mike Johnson",
        phoneNumber: "345-678-9012",
        createdAt: "2024-03-01T12:00:00Z",
        updatedAt: "2024-03-05T12:00:00Z",
        role: "ADMIN",
        status: "INACTIVE",
      },
      {
        id: 4,
        username: "emily_davis",
        name: "Emily Davis",
        phoneNumber: "456-789-0123",
        createdAt: "2024-04-01T12:00:00Z",
        updatedAt: "2024-04-10T12:00:00Z",
        role: "STAFF",
        status: "ACTIVE",
      },
    ],
  },
  {
    id: 3,
    name: "Shop C",
    address: "789 Third Blvd, City C",
    users: [
      {
        id: 5,
        username: "chris_brown",
        name: "Chris Brown",
        phoneNumber: "567-890-1234",
        createdAt: "2024-05-01T12:00:00Z",
        updatedAt: "2024-05-10T12:00:00Z",
        role: "OWNER",
        status: "ACTIVE",
      },
      {
        id: 6,
        username: "sophia_lee",
        name: "Sophia Lee",
        phoneNumber: "678-901-2345",
        createdAt: "2024-06-01T12:00:00Z",
        updatedAt: "2024-06-15T12:00:00Z",
        role: "STAFF",
        status: "INACTIVE",
      },
    ],
  },
  {
    id: 4,
    name: "Shop D",
    address: "101 Fourth Road, City D",
    users: [
      {
        id: 7,
        username: "james_wilson",
        name: "James Wilson",
        phoneNumber: "789-012-3456",
        createdAt: "2024-07-01T12:00:00Z",
        updatedAt: "2024-07-10T12:00:00Z",
        role: "OWNER",
        status: "ACTIVE",
      },
      {
        id: 8,
        username: "olivia_martin",
        name: "Olivia Martin",
        phoneNumber: "890-123-4567",
        createdAt: "2024-08-01T12:00:00Z",
        updatedAt: "2024-08-15T12:00:00Z",
        role: "STAFF",
        status: "ACTIVE",
      },
    ],
  },
];

const Shops = () => {
  const createFilterValue = useCallback(
    (page: number, search: string) => ({
      page,
      search,
    }),
    []
  );
  const [updatedShop, setUpdatedShop] = useState<User>();
  const [openModalUser, setOpenModalUser] = useState(false);
  const [filter, setFilter] = useState(createFilterValue(0, ""));
  const [data, setData] = useState<Shop>([]);
  //   const { data: { data } = {} } = useAppQuery(ApiQuery.users.getUsers(filter));

  const userAtom = useUserAtomValue();
  const isAdmin = userAtom.user?.role === "ADMIN";

  useEffect(() => {
    setData(mockShops);
  }, []);

  const handleOpenModalUser = () => {
    setOpenModalUser(true);
  };

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
      {/* <CreateUserModal>
        <UserSearch filterSearch={filter.search} onSearch={handleSearch} />
      </CreateUserModal> */}
      <UpdateShopModal user={updatedShop}>
        {(data?.length || 0) > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                {isAdmin && <TableHead>Status</TableHead>}
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      {/* <Button
                        variant="link"
                        onClick={handleOpenModalUser}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {user.name}
                      </Button> */}
                      <ListUserModal name={user.name} data={user.users} />
                    </TableCell>
                    <TableCell>{user.address}</TableCell>

                    <TableCell className="flex justify-end w-full">
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          className="w-6 h-6"
                          variant="outline"
                          onClick={() => {
                            setUpdatedShop(user);
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
          <UsersEmptyState />
        )}

        <UserPagination
          isLeftButtonDisabled={filter.page === 0}
          isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
          handleNavigateFullPage={handleNavigateFullPage}
          handleNavigatePage={handleNavigatePage}
        />
      </UpdateShopModal>

      <ListUserModal />
      <Dialog
        open={openModalUser}
        onOpenChange={(open) => open || setUpdatedShop(null)}
      >
        <DialogContent>
          <DialogTitle>User Details</DialogTitle>
          {updatedShop && (
            <div>
              <p>Name: {updatedShop.name}</p>
              <p>Username: {updatedShop.username}</p>
              <p>Phone: {updatedShop.phoneNumber}</p>
              <p>Role: {updatedShop.role}</p>
              <p>Status: {updatedShop.status}</p>
              <p>
                Created At:{" "}
                {new Date(updatedShop.createdAt).toLocaleDateString()}
              </p>
              <p>
                Updated At:{" "}
                {new Date(updatedShop.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default Shops;
