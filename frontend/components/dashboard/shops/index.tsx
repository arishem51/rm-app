"use client";

import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Edit } from "lucide-react";
import { useState } from "react";

const Shops = () => {
  const [filter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(ApiQuery.shops.getShops(filter));

  return (
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
            <TableHead>{index + 1}</TableHead>
            <TableHead>{shop.name}</TableHead>
            <TableHead>{shop.address}</TableHead>
            <TableHead className="text-right">
              <Button size="icon" variant="outline" className="w-6 h-6">
                <Edit />
              </Button>
            </TableHead>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Shops;
