"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  MoreHorizontal, 
  Search, 
  Trash, 
  X
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ApiQuery } from "@/services/query";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import DeleteDebtDialog from "./delete-debt-dialog";
import EditDebtDialog from "./edit-debt-dialog";
import { DebtNote, DebtStatus } from "@/types/debt";

type DebtListProps = {
  debts: DebtNote[];
  isLoading: boolean;
  onFilterChange: (
    status?: DebtStatus,
    partnerId?: number,
    fromDate?: string,
    toDate?: string
  ) => void;
  onDebtUpdated: () => void;
};

export default function DebtList({ 
  debts,
  isLoading,
  onFilterChange,
  onDebtUpdated
}: DebtListProps) {
  const [selectedDebt, setSelectedDebt] = useState<DebtNote | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchPartner, setSearchPartner] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<DebtStatus | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  const partnersQuery = ApiQuery.partners.getPartners();
  const { data: partnersResponse } = useQuery(partnersQuery);
  const partners = Array.isArray(partnersResponse?.data) ? partnersResponse?.data : [];

  const getStatusColor = (status: DebtStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PARTIALLY_PAID":
        return "bg-blue-500";
      case "PAID":
        return "bg-green-500";
      case "OVERDUE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: DebtStatus) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";
      case "PARTIALLY_PAID":
        return "Đã trả một phần";
      case "PAID":
        return "Đã thanh toán";
      case "OVERDUE":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const handleStatusChange = (value: string) => {
    const status = value === "all" ? undefined : value as DebtStatus;
    setSelectedStatus(status);
    onFilterChange(
      status,
      findPartnerId(searchPartner),
      fromDate,
      toDate
    );
  };

  const handlePartnerSearch = () => {
    onFilterChange(
      selectedStatus,
      findPartnerId(searchPartner),
      fromDate,
      toDate
    );
  };

  const handleDateChange = (startDate?: string, endDate?: string) => {
    setFromDate(startDate);
    setToDate(endDate);
    onFilterChange(
      selectedStatus,
      findPartnerId(searchPartner),
      startDate,
      endDate
    );
  };

  const findPartnerId = (search: string): number | undefined => {
    if (!search || !partners || partners.length === 0) return undefined;
    
    const partner = partners.find(p => 
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.toLowerCase().includes(search.toLowerCase())
    );
    return partner?.id;
  };

  const handleResetFilters = () => {
    setSelectedStatus(undefined);
    setSearchPartner("");
    setFromDate(undefined);
    setToDate(undefined);
    onFilterChange(undefined, undefined, undefined, undefined);
  };


  const handleEdit = (debt: DebtNote) => {
    setSelectedDebt(debt);
    setOpenEdit(true);
  };

  const handleDelete = (debt: DebtNote) => {
    setSelectedDebt(debt);
    setOpenDelete(true);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Danh sách công nợ</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="w-full md:w-1/4">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Tìm đối tác"
                value={searchPartner}
                onChange={(e) => setSearchPartner(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={handlePartnerSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Đang chờ</SelectItem>
                <SelectItem value="PARTIALLY_PAID">Đã trả một phần</SelectItem>
                <SelectItem value="PAID">Đã thanh toán</SelectItem>
                <SelectItem value="OVERDUE">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/4">
            <Input
              type="date"
              placeholder="Từ ngày"
              value={fromDate || ""}
              onChange={(e) => handleDateChange(e.target.value, toDate)}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <Input
              type="date"
              placeholder="Đến ngày"
              value={toDate || ""}
              onChange={(e) => handleDateChange(fromDate, e.target.value)}
            />
          </div>

          <Button variant="outline" onClick={handleResetFilters}>
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Đối tác</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Đã thanh toán</TableHead>
              <TableHead>Ngày đến hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 9 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : debts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              debts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell>#{debt.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{debt.partnerId}</div>
                  </TableCell>
                  <TableCell>{toCurrency(debt.totalAmount || 0)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(debt.status)}>
                      {getStatusText(debt.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {debt.description || '-'}
                  </TableCell>
                  <TableCell>
                    {debt.createdAt ? format(new Date(debt.createdAt), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(debt)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(debt)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedDebt && (
        <>
          
          <DeleteDebtDialog
            open={openDelete}
            onOpenChange={setOpenDelete}
            debtId={selectedDebt.id}
            onDeleted={onDebtUpdated}
          />
          
          <EditDebtDialog
            open={openEdit}
            onOpenChange={setOpenEdit}
            debt={selectedDebt}
            onUpdated={onDebtUpdated}
          />
        </>
      )}
    </div>
  );
}