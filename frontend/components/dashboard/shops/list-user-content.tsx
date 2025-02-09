import { useForm } from "react-hook-form";
import { CreateShopRequest, User } from "@/types/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQuery } from "@/services/query";
import { useCreateShop } from "@/hooks/mutations/shop";
import { useGetMe } from "@/hooks/mutations/user";
import UserPagination from "../users/pagination";
import UsersEmptyState from "../users/empty-state";
import { Fragment, useCallback, useState } from "react";
import UserUpdateModal from "../users/update-user-modal";
import { Badge, UserPen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { lowerCase, startCase } from "lodash";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useUserAtomValue } from "@/store/user";
import useAppQuery from "@/hooks/use-app-query";
import { cn } from "@/lib/utils";
import CreateUserModal from "../users/create-user-modal";
import UserSearch from "./shop-search";

const schemaFields = {
  name: z.string().nonempty({ message: "Name is required" }),
  address: z.string().nonempty({ message: "Address is required" }),
};

type Props = {
  onClose: () => void;
};

const ListUserContent = ({ onClose }: Props) => {
  const form = useForm<CreateShopRequest>({
    defaultValues: {
      name: "",
      address: "",
    },
    resolver: zodResolver(z.object(schemaFields)),
  });
  const createFilterValue = useCallback(
    (page: number, search: string) => ({
      page,
      search,
    }),
    []
  );
  const [updatedUser, setUpdatedUser] = useState<User>();
  const [filter, setFilter] = useState(createFilterValue(0, ""));
  const { data: { data } = {} } = useAppQuery(ApiQuery.users.getUsers(filter));
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
  const { mutate: createShop, isPending } = useCreateShop();
  const { data: userData } = useGetMe();
  const queryClient = useQueryClient();

  const handleSubmit = form.handleSubmit((data: CreateShopRequest) => {
    createShop(
      { ...data },
      {
        onSuccess: (res) => {
          console.log("res: ", res);
          toast({
            variant: "default",
            title: "Success",
            description: "Create shop successfully",
          });
          onClose();
          //   queryClient.invalidateQueries({
          //     queryKey: ApiQuery.users.getShop().queryKey,
          //   });
        },
      }
    );
  });

  return (
    <Fragment>
      <CreateUserModal>
        <UserSearch filterSearch={filter.search} onSearch={handleSearch} />
      </CreateUserModal>
      <UserUpdateModal user={updatedUser}>
        {(data?.data?.length || 0) > 0 ? (
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
                        <Badge className=" text-xs p-[4px] py-0 ml-0.5">
                          Current
                        </Badge>
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

export default ListUserContent;
