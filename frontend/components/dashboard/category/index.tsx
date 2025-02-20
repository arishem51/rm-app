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

const Categories = () => {
  const [filter, setFilter] = useState({ page: 0, search: "" });
  const { data: { data } = {} } = useAppQuery(
    ApiQuery.categories.getCategories(filter)
  );
  const [updateCategory, setUpdateCategory] = useState<Category>();
  const handleSearch = (search: string) => {
    setFilter({ page: 0, search });
  };

  return (
    <Fragment>
      <div className="flex justify-between">
        <HeaderListSearch
          filterSearch={filter.search}
          onSearch={handleSearch}
        />
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
            <DialogTitle>Create Category</DialogTitle>
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
              <TableHead>STT</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
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
    </Fragment>
  );
};

export default Categories;
