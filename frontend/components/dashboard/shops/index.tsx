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
import HeaderListSearch from "../header-list-search";
import { ShopDTO } from "@/types/Api";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import ShopForm from "@/components/shop-form";

const Shops = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(ApiQuery.shops.getShops(filter));
  const [updateShop, setUpdateShop] = useState<ShopDTO>();
  const handleSearch = (search: string) => {
    setFilter({ page: 0, search });
  };

  return (
    <Fragment>
      <HeaderListSearch filterSearch={filter.search} onSearch={handleSearch} />
      <Dialog
        open={!!updateShop}
        onOpenChange={(e) => {
          if (!e) {
            setUpdateShop(undefined);
          }
        }}
      >
        <DialogTitle className="hidden">Create Modal</DialogTitle>
        <DialogContent>
          <ShopForm
            onClose={() => {
              setUpdateShop(undefined);
            }}
            shop={updateShop}
          />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((shop, index) => (
            <TableRow key={shop.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{shop.name}</TableCell>
              <TableCell>{shop.address}</TableCell>
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
    </Fragment>
  );
};

export default Shops;
