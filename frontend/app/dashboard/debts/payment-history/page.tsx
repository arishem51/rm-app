"use client";

import { useState } from "react";
import { ApiQuery } from "@/services/query";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentHistoryPage() {
  const [selectedDebtId, setSelectedDebtId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  const debtNotesQuery = ApiQuery.debts.getDebtNotes({});
  const { data: debtsResponse } = useQuery(debtNotesQuery);
  const debts = Array.isArray(debtsResponse) ? debtsResponse : [];
  
  const paymentsQuery = ApiQuery.debts.getDebtPayments(selectedDebtId || 0);
  const { data: payments, isLoading } = selectedDebtId ? useQuery(paymentsQuery) : { data: undefined, isLoading: false };

  const selectedDebt = selectedDebtId ? debts.find(debt => debt.id === selectedDebtId) : undefined;

  const filteredPayments = payments?.filter(payment => {
    if (!payment.paymentDate) return true;
    
    const paymentDate = new Date(payment.paymentDate);
    const fromDateObj = fromDate ? new Date(fromDate) : null;
    const toDateObj = toDate ? new Date(toDate) : null;

    if (fromDateObj && paymentDate < fromDateObj) return false;
    if (toDateObj && paymentDate > toDateObj) return false;
    
    return true;
  });
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6 gap-2">
        <Link href="/dashboard/debts">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Lịch sử thanh toán công nợ</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chọn công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedDebtId?.toString()} onValueChange={(value) => setSelectedDebtId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn công nợ để xem lịch sử" />
              </SelectTrigger>
              <SelectContent>
                {debts.map((debt) => (
                  <SelectItem key={debt.id} value={debt.id?.toString() || ""}>
                    {debt.partner?.name} - {toCurrency(debt.amount || 0)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Từ ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={fromDate || ""}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đến ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={toDate || ""}
              onChange={(e) => setToDate(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
      
      {selectedDebt && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Đối tác</dt>
                <dd className="mt-1 text-lg">{selectedDebt.partner?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tổng số nợ</dt>
                <dd className="mt-1 text-lg font-semibold">{toCurrency(selectedDebt.amount || 0)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Đã thanh toán</dt>
                <dd className="mt-1 text-lg text-green-600 font-semibold">{toCurrency(selectedDebt.paidAmount || 0)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ngày đến hạn</dt>
                <dd className="mt-1 text-lg">
                  {selectedDebt.dueDate ? format(new Date(selectedDebt.dueDate), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${selectedDebt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    selectedDebt.status === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-800' : 
                    selectedDebt.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                    selectedDebt.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {selectedDebt.status === 'PENDING' ? 'Đang chờ' : 
                    selectedDebt.status === 'PARTIALLY_PAID' ? 'Đã trả một phần' : 
                    selectedDebt.status === 'PAID' ? 'Đã thanh toán' : 
                    selectedDebt.status === 'OVERDUE' ? 'Quá hạn' : selectedDebt.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Còn lại</dt>
                <dd className="mt-1 text-lg text-red-600 font-semibold">
                  {toCurrency((selectedDebt.amount || 0) - (selectedDebt.paidAmount || 0))}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDebtId ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Số biên lai</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 7 }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredPayments && filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>#{payment.id}</TableCell>
                        <TableCell className="font-medium">{toCurrency(payment.amount || 0)}</TableCell>
                        <TableCell>
                          {payment.paymentMethod === 'CASH' ? 'Tiền mặt' :
                          payment.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' :
                          payment.paymentMethod === 'CREDIT_CARD' ? 'Thẻ tín dụng' : payment.paymentMethod}
                        </TableCell>
                        <TableCell>{payment.receiptNumber || '-'}</TableCell>
                        <TableCell>
                          {payment.paymentDate ? format(new Date(payment.paymentDate), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{payment.notes || '-'}</TableCell>
                        <TableCell>
                          {payment.createdAt ? format(new Date(payment.createdAt), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        {selectedDebtId ? 'Không có lịch sử thanh toán' : 'Vui lòng chọn công nợ để xem lịch sử thanh toán'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Vui lòng chọn công nợ để xem lịch sử thanh toán
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 