"use client";

import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { ArrowUpRight, Plus } from "lucide-react";
import { Fragment, useState } from "react";
import EmptyState from "../empty-state";
import HeaderListSearch from "../header-list-search";
import { useMe } from "@/hooks/mutations/user";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createSttNumber } from "@/lib/utils";
import ListPagination from "../pagination";
import Image from "next/image";
import defaultPic from "../../../public/images/default-product.png";
import { checkRole } from "@/lib/helpers";

const Products = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.products.getProducts(filter)
  );
  const { data: currentUser } = useMe();

  const { isAdmin, isOwner } = checkRole(currentUser);
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
      <div className="flex justify-between">
        <HeaderListSearch
          filterSearch={filter.search}
          onSearch={handleSearch}
        />
        {isOwner && (
          <Link href="/dashboard/products/create" prefetch>
            <Button>
              <Plus />
              Tạo sản phẩm
            </Button>
          </Link>
        )}
      </div>
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Ảnh</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              {isAdmin && <TableHead>Cửa hàng</TableHead>}
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{createSttNumber(index, filter.page)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Image
                    src={product.imageUrls?.[0] ?? defaultPic}
                    alt={product.name ?? ""}
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.category?.name ? "default" : "outline"}
                    className="px-1 py-0.5"
                  >
                    {product.category?.name || "Không tồn tại"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.supplier?.name ? "default" : "outline"}
                    className="px-1 py-0.5"
                  >
                    {product.supplier?.name || "Không tồn tại"}
                  </Badge>
                </TableCell>
                {isAdmin && <TableCell>{product.shopName}</TableCell>}
                <TableCell className="text-right">
                  <Link href={`/dashboard/products/${product.id}`} prefetch>
                    <Button variant="outline" className="w-6 h-6" size="icon">
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
      <ListPagination
        isLeftButtonDisabled={filter.page === 0}
        isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
        handleNavigateFullPage={handleNavigateFullPage}
        handleNavigatePage={handleNavigatePage}
      />
    </Fragment>
  );
};

export default Products;
