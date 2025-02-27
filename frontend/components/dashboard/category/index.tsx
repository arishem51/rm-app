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
import { Edit, Plus } from "lucide-react";
import { Fragment, useState } from "react";
import HeaderListSearch from "../header-list-search";
import { Category } from "@/types/Api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "../empty-state";
import CategoryForm from "./category-form";
import ListPagination from "../pagination";
import { DatePicker } from "./date-picker";
import { format } from "date-fns";
import Image from "next/image";
import defaultPic from "../../../public/images/default-product.png";

const Categories = () => {
  const [filter, setFilter] = useState({ page: 0, search: "", createdAt: "" });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.categories.getCategories(filter)
  );
  const [updateCategory, setUpdateCategory] = useState<Category>();

  const handleNavigatePage = (page: number) => {
    setFilter((prev) => ({
      page: prev.page + page,
      search: prev.search,
      createdAt: prev.createdAt,
    }));
  };
  const handleNavigateFullPage = (page: number) => {
    const isRight = page > 0;
    setFilter({
      page: isRight ? (data?.totalPages ?? 0) - 1 : 0,
      search: filter.search,
      createdAt: filter.createdAt,
    });
  };

  const handleSearch = (search: string) => {
    setFilter({ page: 0, search, createdAt: filter.createdAt });
  };

  return (
    <Fragment>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <HeaderListSearch
            filterSearch={filter.search}
            onSearch={handleSearch}
          />
          <span className="text-sm whitespace-nowrap">Created At:</span>
          <DatePicker
            onSelect={(e) => {
              if (e) {
                setFilter({
                  page: 0,
                  search: filter.search,
                  createdAt: format(e, "yyyy-MM-dd"),
                });
              }
            }}
          />
        </div>
        <Button
          type="button"
          onClick={() => {
            setUpdateCategory({} as Category);
          }}
        >
          <Plus />
          <span>Create Category</span>
        </Button>
      </div>
      <Dialog
        open={!!updateCategory}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setUpdateCategory(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {updateCategory?.id ? "Update" : "Create"} Category
            </DialogTitle>
            <DialogDescription>
              Enter the details for the new category. Click save once
              you&apos;re finished to add it to your collection.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onClose={() => {
              setUpdateCategory(undefined);
            }}
            category={updateCategory}
          />
        </DialogContent>
      </Dialog>
      {(data?.data || []).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Image
                    src={category.imageUrl ?? defaultPic}
                    alt={category.name ?? ""}
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell>{category.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {
                      setUpdateCategory(category);
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
      <ListPagination
        isLeftButtonDisabled={filter.page === 0}
        isRightButtonDisabled={filter.page >= (data?.totalPages ?? 0) - 1}
        handleNavigateFullPage={handleNavigateFullPage}
        handleNavigatePage={handleNavigatePage}
      />
    </Fragment>
  );
};

export default Categories;
