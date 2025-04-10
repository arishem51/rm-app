// components/partners/create-debt-detail-dialog.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from "axios";
import { useAuthAtomValue } from "@/store/auth";
import { numberToVietnameseWords } from "@/lib/utils";

interface Props {
    partnerId: number;
    defaultAmount?: number;
    defaultIsPlus?: boolean;
    defaultDescription?: string;
    children: React.ReactNode;
    onCreated?: () => void;
}

const CreateDebtDetailDialog = ({
                                    partnerId,
                                    defaultAmount = 0,
                                    defaultIsPlus = true,
                                    defaultDescription = "",
                                    children,
                                    onCreated,
                                }: Props) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(defaultAmount);
    const [description, setDescription] = useState(defaultDescription);
    const [isPlus, setIsPlus] = useState(defaultIsPlus);
    const [loading, setLoading] = useState(false);
    const token = useAuthAtomValue().token;

    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await axios.post(
                "http://localhost:8080/api/debt-details",
                {
                    partnerId,
                    createdAt: new Date(),
                    amount,
                    description,
                    isPlus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onCreated?.();
            setSnackbarMessage(`Đã tạo khoản công nợ ${amount.toLocaleString("vi-VN")} ₫`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setOpen(false);
        } catch (err) {
            console.error("Error creating debt detail", err);
            setSnackbarMessage("Không thể tạo khoản công nợ. Vui lòng thử lại.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tạo khoản công nợ</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label>Số tiền</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                            <div className="text-sm text-muted-foreground italic">
                                {numberToVietnameseWords(amount)}
                            </div>
                        </div>
                        <div>
                            <Label>Mô tả</Label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={isPlus ? "default" : "outline"}
                                onClick={() => setIsPlus(true)}
                            >
                                Plus +
                            </Button>
                            <Button
                                variant={!isPlus ? "default" : "outline"}
                                onClick={() => setIsPlus(false)}
                            >
                                Minus -
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setOpen(false)} variant="outline">
                            Huỷ
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            Tạo
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ✅ Snackbar được render ngoài Dialog để không mất khi đóng */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateDebtDetailDialog;
