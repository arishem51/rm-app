"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiQuery } from "@/services/query";
import { useQuery } from "@tanstack/react-query";
import { useUpdateDebtNote } from "@/hooks/mutations/debt";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DebtNote, UpdateDebtNoteDTO } from "@/types/Api";
import { toast } from "@/hooks/use-toast";

interface EditDebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: DebtNote;
  onUpdated: () => void;
}

export default function EditDebtDialog({
  open,
  onOpenChange,
  debt,
  onUpdated
}: EditDebtDialogProps) {
  const [formData, setFormData] = useState<UpdateDebtNoteDTO>({});

  useEffect(() => {
    if (debt) {
      setFormData({
        partnerId: debt.partner?.id,
        amount: debt.amount,
        dueDate: debt.dueDate,
        status: debt.status,
        description: debt.description,
        notes: debt.notes
      });
    }
  }, [debt]);

  const partnersQuery = ApiQuery.partners.getPartners();
  const { data: partnersResponse } = useQuery(partnersQuery);
  const partners = Array.isArray(partnersResponse?.data) ? partnersResponse?.data : [];

  const updateDebtNote = useUpdateDebtNote();

  const handleChange = (field: keyof UpdateDebtNoteDTO, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.partnerId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn đối tác",
      });
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập số tiền hợp lệ",
      });
      return;
    }

    if (!formData.dueDate) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ngày đến hạn",
      });
      return;
    }

    try {
      await updateDebtNote.mutateAsync({
        id: debt.id!,
        ...formData
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật công nợ",
      });
      onUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể cập nhật công nợ",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa công nợ</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="partner">Đối tác</Label>
            <Select
              value={formData.partnerId?.toString()}
              onValueChange={(value) => handleChange("partnerId", parseInt(value))}
            >
              <SelectTrigger id="partner">
                <SelectValue placeholder="Chọn đối tác" />
              </SelectTrigger>
              <SelectContent>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id?.toString() || ""}>
                    {partner.name} - {partner.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Số tiền</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount || ""}
              onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Ngày đến hạn</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate || ""}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Đang chờ</SelectItem>
                <SelectItem value="PARTIALLY_PAID">Đã trả một phần</SelectItem>
                <SelectItem value="PAID">Đã thanh toán</SelectItem>
                <SelectItem value="OVERDUE">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả về khoản nợ"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Ghi chú bổ sung"
              value={formData.notes || ""}
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
            disabled={updateDebtNote.isPending}
          >
            {updateDebtNote.isPending ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 