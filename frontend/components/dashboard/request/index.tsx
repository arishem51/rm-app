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
import { Fragment, useState, useMemo } from "react";
import EmptyState from "../empty-state";
import HeaderListSearch from "../header-list-search";
import { Badge } from "@/components/ui/badge";
import ListPagination from "../pagination";
import Image from "next/image";
import defaultPic from "../../../public/images/default-product.png";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format, formatDistanceToNow, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ToastTitle } from "@/lib/constants";
import { useHandleRequest } from "@/hooks/mutations/requests";
import { EyeIcon } from "lucide-react";
import { ProductDetailModal } from "./detail";
import { checkRole } from "@/lib/helpers";
import { useMe } from "@/hooks/mutations/user";
const PAGE_SIZE = 5; // Số lượng item trên mỗi trang

const Requests = () => {
    const { data: currentUser } = useMe();
    const { isAdmin, isOwner } = checkRole(currentUser);
    const queryClient = useQueryClient();
    const handleRequest = useHandleRequest();
    const { toast } = useToast();
    const handleApprove = async (id: number, status: boolean) => {
        const result = await Swal.fire({
            title: status ? "Xác nhận chấp nhận?" : "Xác nhận từ chối?",
            text: status
                ? "Bạn có chắc muốn chấp nhận yêu cầu này?"
                : "Bạn có chắc muốn từ chối yêu cầu này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: status ? "Chấp nhận" : "Từ chối",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await handleRequest.mutateAsync({ id, status });
                toast({
                    title: ToastTitle.success,
                    description: status
                        ? "Yêu cầu đã được chấp nhận."
                        : "Yêu cầu đã bị từ chối.",
                });
                await queryClient.invalidateQueries(
                    ApiQuery.requests.getAllRequests()
                );
            } catch (error) {
                toast({
                    title: ToastTitle.somethingWentWrong,
                    description:
                        "Lỗi xảy ra, vui lồng thu lại : " + error.message,
                    variant: "destructive",
                });
            }
        }
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();

        // Nếu thời gian dưới 24 giờ thì hiển thị "X giờ trước"
        if (date > subDays(now, 1)) {
            return formatDistanceToNow(date, { addSuffix: true, locale: vi });
        }

        // Nếu xa hơn 1 ngày, hiển thị theo định dạng ngày/tháng/năm
        return format(date, "dd/MM/yyyy HH:mm:ss");
    };
    const [filter, setFilter] = useState({
        page: 0,
        search: "",
        category: "",
        supplier: "",
        status: "",
    });

    // Lấy toàn bộ dữ liệu từ API
    const { data } = useAppQuery(ApiQuery.requests.getAllRequests());
    console.log(data);
    const { data: categoryData } = useAppQuery(
        ApiQuery.categories.getAllCategories()
    );
    const { data: supplierData } = useAppQuery(
        ApiQuery.partners.getAllPartners()
    );
    // Xử lý dữ liệu theo filter (search, category, supplier)
    const filteredData = useMemo(() => {
        if (!data?.data) return [];

        return data.data
            .filter((product) => product.createBy === currentUser?.username)
            .filter((product) =>
                filter.search
                    ? product.productName
                          .toLowerCase()
                          .includes(filter.search.toLowerCase())
                    : true
            )
            .filter((product) =>
                filter.category && filter.category !== "all"
                    ? product.categoryName === filter.category
                    : true
            )
            .filter((product) =>
                filter.supplier && filter.supplier !== "all"
                    ? product.supplierName === filter.supplier
                    : true
            ).filter((product) =>
              filter.status && filter.status !== "all"
                  ? product.status === filter.status
                  : true
          );
    }, [data, filter]);

    const paginatedData = useMemo(() => {
        const startIndex = filter.page * PAGE_SIZE;
        return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredData, filter.page]);

    const handleSearch = (search: string) => {
        setFilter((prev) => ({ ...prev, page: 0, search }));
    };

    const handleCategoryChange = (category: string) => {
        setFilter((prev) => ({ ...prev, page: 0, category }));
    };

    const handleSupplierChange = (supplier: string) => {
        setFilter((prev) => ({ ...prev, page: 0, supplier }));
    };

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
    }, [filteredData]);

    const handleNavigatePage = (page: number) => {
        setFilter((prev) => ({
            ...prev,
            page: Math.max(0, Math.min(prev.page + page, totalPages - 1)),
        }));
    };

    const handleNavigateFullPage = (page: number) => {
        setFilter((prev) => ({ ...prev, page: page > 0 ? totalPages - 1 : 0 }));
    };

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };
    const handleFilterChange = (key: string, value: string) => {
      setFilter((prev) => ({ ...prev, page: 0, [key]: value }));
  };
    return (
        <Fragment>
            <div className="flex justify-between items-center">
                <HeaderListSearch
                    filterSearch={filter.search}
                    onSearch={handleSearch}
                />

                <div className="flex gap-4">
                    <Select onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {categoryData?.data.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.name}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={handleSupplierChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn nhà cung cấp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {supplierData?.data.map((supplier) => (
                                <SelectItem
                                    key={supplier.id}
                                    value={supplier.name}
                                >
                                    {supplier.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(val) => handleFilterChange("status", val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="PENDING">Đang chờ</SelectItem>
                            <SelectItem value="APPROVED">Đã chấp nhận</SelectItem>
                            <SelectItem value="REJECTED">Đã từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {paginatedData.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Request</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>Ảnh</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Nhà cung cấp</TableHead>
                            <TableHead>Thời gian tạo</TableHead>
                            <TableHead>Nhân viên tạo</TableHead>
                            <TableHead className="text-right">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((product, index) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>
                                    <Image
                                        src={defaultPic}
                                        alt={product.productName ?? ""}
                                        width={50}
                                        height={50}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            product.categoryName
                                                ? "default"
                                                : "outline"
                                        }
                                        className="px-1 py-0.5"
                                    >
                                        {product.categoryName ||
                                            "Không tồn tại"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            product.supplierName
                                                ? "default"
                                                : "outline"
                                        }
                                        className="px-1 py-0.5"
                                    >
                                        {product.supplierName ||
                                            "Không tồn tại"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {formatDate(product.createdAt)}
                                </TableCell>
                                <TableCell>{product.createBy}</TableCell>
                                <TableCell className="text-right">
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleOpenModal(product)
                                            }
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Button>
                                        {!isOwner&&(
                                           <>
                                           <Button>{product.status}</Button>
                                           
                                          </>
                                        )}
                                        {isOwner && product.status !== "PENDING" && (
                                        <>
                                            <Button>{product.status}</Button>
                                            
                                        </>
                                        )}
                                        {isOwner && product.status === "PENDING" && (
                                        <>
                                            <Button onClick={() => handleApprove(product.id, true)}>Chấp nhận</Button>
                                            <Button variant="destructive" onClick={() => handleApprove(product.id, false)}>Từ chối</Button>
                                        </>
                                      )}
                                    </TableCell>
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
                isRightButtonDisabled={filter.page >= totalPages - 1}
                handleNavigateFullPage={handleNavigateFullPage}
                handleNavigatePage={handleNavigatePage}
            />
            <ProductDetailModal
                product={selectedProduct} 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
            />
        </Fragment>
    );
};

export default Requests;
