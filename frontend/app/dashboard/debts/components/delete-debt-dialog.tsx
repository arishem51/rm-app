"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteDebtNote } from "@/hooks/mutations/debt";
import { toast } from "@/hooks/use-toast";

interface DeleteDebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debtId: number;
  onDeleted: () => void;
}

export default function DeleteDebtDialog({
  open,
  onOpenChange,
  debtId,
  onDeleted,
}: DeleteDebtDialogProps) {
  const deleteDebtNote = useDeleteDebtNote();

  const handleDelete = async () => {
    try {
      await deleteDebtNote.mutateAsync(debtId);
      toast({
        title: "Thành công",
        description: "Đã xóa công nợ",
      });
      onDeleted();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể xóa công nợ này",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa công nợ</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa công nợ này? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteDebtNote.isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 