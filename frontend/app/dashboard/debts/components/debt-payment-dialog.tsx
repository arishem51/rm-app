"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DebtNote, CreateDebtPaymentDTO } from "@/types/debt";
import { useCreateDebtPayment } from "@/hooks/mutations/debt";
import { toast } from "@/hooks/use-toast";
import { toCurrency } from "@/lib/utils";

interface DebtPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: DebtNote;
  onPaymentAdded: () => void;
}

export default function DebtPaymentDialog({
  open,
  onOpenChange,
  debt,
  onPaymentAdded
}: DebtPaymentDialogProps) {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<CreateDebtPaymentDTO>({
    amount: 0,
    paymentDate: today,
    paymentMethod: "CASH",
    receiptNumber: "",
    notes: ""
  });

  const createDebtPayment = useCreateDebtPayment();

  const handleChange = (field: keyof CreateDebtPaymentDTO, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const remainingAmount = debt.amount - debt.paidAmount;

  const handleSubmit = async () => {
    if (!formData.amount || formData.amount <= 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập số tiền hợp lệ",
      });
      return;
    }

    if (formData.amount > remainingAmount) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Số tiền thanh toán không thể lớn hơn số nợ còn lại",
      });
      return;
    }

    if (!formData.paymentDate) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ngày thanh toán",
      });
      return;
    }

    if (!formData.paymentMethod) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn phương thức thanh toán",
      });
      return;
    }

    try {
      await createDebtPayment.mutateAsync({
        debtId: debt.id,
        ...formData
      });
      toast({
        title: "Thành công",
        description: "Đã thêm thanh toán mới",
      });
      setFormData({
        amount: 0,
        paymentDate: today,
        paymentMethod: "CASH",
        receiptNumber: "",
        notes: ""
      });
      onPaymentAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể tạo thanh toán mới",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thanh toán công nợ</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="text-sm font-medium">Đối tác: {debt.partnerName}</p>
              <p className="text-sm text-muted-foreground">Tổng nợ: {toCurrency(debt.amount)}</p>
              <p className="text-sm text-muted-foreground">Đã thanh toán: {toCurrency(debt.paidAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Còn lại</p>
              <p className="text-lg font-bold text-primary">{toCurrency(remainingAmount)}</p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Số tiền thanh toán</Label>
            <Input
              id="amount"
              type="number"
              max={remainingAmount}
              value={formData.amount || ""}
              onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="paymentDate">Ngày thanh toán</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleChange("paymentDate", e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange("paymentMethod", value)}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Tiền mặt</SelectItem>
                <SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem>
                <SelectItem value="CREDIT_CARD">Thẻ tín dụng</SelectItem>
                <SelectItem value="OTHER">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="receiptNumber">Số biên lai (nếu có)</Label>
            <Input
              id="receiptNumber"
              placeholder="Số biên lai"
              value={formData.receiptNumber}
              onChange={(e) => handleChange("receiptNumber", e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Ghi chú về thanh toán"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createDebtPayment.isPending}
          >
            {createDebtPayment.isPending ? "Đang xử lý..." : "Thanh toán"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}