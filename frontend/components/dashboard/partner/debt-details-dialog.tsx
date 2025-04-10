// components/partners/debt-details-dialog.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {ReactNode, useEffect, useState} from "react";
import { Partner } from "@/types/Api";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {useAuthAtomValue} from "@/store/auth";
import CreateDebtDetailDialog from "@/components/dashboard/partner/create-debt-detail-dialog";

interface DebtDetailsDialogProps {
    partner: Partner;
    children: ReactNode;
    onDebtUpdated?: () => void;
}

interface DebtDetail {
    id: number;
    createdAt: string;
    amount: number;
    description: string;
    isPlus: boolean;
}

const DebtDetailsDialog = ({ partner, children, onDebtUpdated }: DebtDetailsDialogProps) => {
    const [open, setOpen] = useState(false);
    const [debtDetails, setDebtDetails] = useState<DebtDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const token = useAuthAtomValue().token;

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(amount);
    }
    const fetchDebtDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8080/api/debt-details/${partner.id}`, {
                params: {
                    fromDate:'',
                    toDate:'',
                    page: 0,
                    pageSize: 10,
                },
                headers: {
                    Authorization: `Bearer ${token}`, // 👈 truyền token vào đây
                },
            });
            setDebtDetails(res.data.data.content);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu công nợ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchDebtDetails();
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger> {/* 👈 dùng trigger từ props */}
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Công nợ - {partner.name}</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="text-center py-6">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Create Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Debt Type</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {debtDetails.map((item) => {
                                    const displayAmount = item.isPlus ? item.amount : -item.amount;

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.createdAt}</TableCell>
                                            <TableCell>{formatCurrency(displayAmount)}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{item.isPlus ? 'Plus +' : 'Minus -'}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <CreateDebtDetailDialog
                                                        partnerId={partner.id!}
                                                        defaultAmount={Math.abs(displayAmount)}
                                                        defaultIsPlus={false}
                                                        defaultDescription={`Thanh toán khoản vay ${item.id}`}
                                                        onCreated={() => {
                                                            fetchDebtDetails();
                                                            onDebtUpdated?.();
                                                        }}
                                                    >
                                                        <Button variant="outline" size="sm" disabled={displayAmount < 0}>
                                                            Minus -
                                                        </Button>
                                                    </CreateDebtDetailDialog>

                                                    <CreateDebtDetailDialog
                                                        partnerId={partner.id!}
                                                        defaultAmount={Math.abs(displayAmount)}
                                                        defaultIsPlus={true}
                                                        defaultDescription={`Thanh toán khoản vay ${item.id}`}
                                                    >
                                                        <Button variant="default" size="sm" disabled={displayAmount > 0}>
                                                            Plus +
                                                        </Button>
                                                    </CreateDebtDetailDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DebtDetailsDialog;
