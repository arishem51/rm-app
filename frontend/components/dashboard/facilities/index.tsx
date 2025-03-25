"use client";

import {
  TableHeader,
  TableRow,
  TableBody,
  Table,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Fragment, useState } from "react";
import EmptyState from "../empty-state";
import ListPagination from "../pagination";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Plus } from "lucide-react";
import { WarehouseDTO } from "@/types/Api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FacilityForm from "./facility-form";
import { format } from "date-fns";
import Link from "next/link";
import MultiHeaderListSearch from "../search/multi-theader-list-search";

type FilterSearchType = {
  search: string;
  address: string;
};

const Facilities = () => {
  const [filter, setFilter] = useState<{ page: number } & FilterSearchType>({
    page: 0,
    search: "",
    address: "",
  });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.warehouses.getWarehouses(filter)
  );

  const handleNavigatePage = (page: number) => {
    setFilter((prev) => ({
      page: prev.page + page,
      search: prev.search,
      address: prev.address,
    }));
  };
  const [updateWarehouse, setUpdateWarehouse] = useState<WarehouseDTO>();

  const handleNavigateFullPage = (page: number) => {
    const isRight = page > 0;
    setFilter({
      page: isRight ? (data?.totalPages ?? 0) - 1 : 0,
      search: filter.search,
      address: filter.address,
    });
  };

  const factoryItems = (props: {
    placeholder?: string;
    name: keyof FilterSearchType;
  }) => {
    return {
      filterSearch: filter[props.name],
      placeholder: props.placeholder,
      name: props.name,
    };
  };

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <MultiHeaderListSearch
          items={[
            factoryItems({ placeholder: "Nhập tên kho", name: "search" }),
            factoryItems({
              placeholder: "Nhập địa chỉ kho",
              name: "address",
            }),
          ]}
          onSearchClick={(items) => {
            const searchItems: Record<keyof FilterSearchType, string> =
              items.reduce(
                (acc, cur) => {
                  return {
                    ...acc,
                    [cur.name]: cur.search,
                  };
                },
                {} as Record<keyof FilterSearchType, string>
              );
            setFilter({ page: 0, ...searchItems });
          }}
        />
        <Button
          onClick={() => {
            setUpdateWarehouse({} as WarehouseDTO);
          }}
        >
          <Plus />
          Tạo kho
        </Button>
      </div>
      <Dialog
        open={!!updateWarehouse}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setUpdateWarehouse(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{updateWarehouse?.id ? "Sửa" : "Tạo"} kho</DialogTitle>
            <DialogDescription>
              Nhập thông tin cho kho mới. Nhấn lưu khi bạn đã hoàn thành để thêm
              vào bộ sưu tập của bạn.
            </DialogDescription>
          </DialogHeader>
          <FacilityForm
            onClose={() => {
              setUpdateWarehouse(undefined);
            }}
            warehouse={updateWarehouse}
          />
        </DialogContent>
      </Dialog>
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Số lượng khu vực trong kho</TableHead>
              <TableHead>Thời điểm tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell>{warehouse.id}</TableCell>
                <TableCell>{warehouse.name}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>{warehouse.numberOfZone} khu</TableCell>
                <TableCell>
                  {format(warehouse.createdAt!, "yyyy-MM-dd hh:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    prefetch
                    href={`/dashboard/warehouses/facilities/${warehouse.id}`}
                  >
                    <Button size="icon" variant="outline" className="w-6 h-6">
                      <ArrowUpRight />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState />
      )}
      {(data?.data?.length ?? 0) > 0 && (
        <ListPagination
          isLeftButtonDisabled={filter.page === 0}
          isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
          handleNavigateFullPage={handleNavigateFullPage}
          handleNavigatePage={handleNavigatePage}
        />
      )}
    </Fragment>
  );
};

export default Facilities;
