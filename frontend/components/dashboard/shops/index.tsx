"use client";

import { Button } from "@/components/ui/button";
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
import { Edit } from "lucide-react";
import { Fragment, useState } from "react";
import HeaderListSearch from "../search/header-list-search";
import { ShopDTO } from "@/types/Api";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import ShopForm from "@/components/form/shop-form";
import EmptyState from "../empty-state";
import ListPagination from "../pagination";

const Shops = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(ApiQuery.shops.getShops(filter));
  const [updateShop, setUpdateShop] = useState<ShopDTO>();

  const handleSearch = (search: string) => {
    setFilter({ page: 0, search });
  };
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

  return (
    <Fragment>
      <HeaderListSearch filterSearch={filter.search} onSearch={handleSearch} />
      <Dialog
        open={!!updateShop}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setUpdateShop(undefined);
          }
        }}
      >
        <DialogTitle className="hidden">Update Shop</DialogTitle>
        <DialogContent>
          <ShopForm
            onClose={() => {
              setUpdateShop(undefined);
            }}
            shop={updateShop}
          />
        </DialogContent>
      </Dialog>
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead>Thời điểm tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((shop, index) => (
              <TableRow key={shop.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{shop.name}</TableCell>
                <TableCell>{shop.address}</TableCell>
                <TableCell>{shop.createdBy?.name}</TableCell>
                <TableCell>{shop.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {
                      setUpdateShop(shop);
                    }}
                    size="icon"
                    variant="outline"
                    className="w-6 h-6"
                  >
                    <Edit />
                  </Button>
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

export default Shops;