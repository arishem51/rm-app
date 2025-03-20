"use client";

import { useState } from "react";
import { ApiQuery } from "@/services/query";
import DebtList from "./components/debt-list";
import DebtStats from "./components/debt-stats";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddDebtDialog from "./components/add-debt-dialog";
import { useQuery } from "@tanstack/react-query";

export default function DebtsPage() {
  const [openAddDebt, setOpenAddDebt] = useState(false);
  const [status, setStatus] = useState<"PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | undefined>(undefined);
  const [partnerId, setPartnerId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  const debtQuery = ApiQuery.debts.getDebtNotes({
    status,
    partnerId,
    fromDate,
    toDate
  });
  
  const { data: debtsResponse, isLoading, refetch } = useQuery(debtQuery);
  const debts = Array.isArray(debtsResponse) ? debtsResponse : [];

  const handleFilterChange = (
    newStatus?: "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE",
    newPartnerId?: number,
    newFromDate?: string,
    newToDate?: string
  ) => {
    setStatus(newStatus);
    setPartnerId(newPartnerId);
    setFromDate(newFromDate);
    setToDate(newToDate);
  };

  const handleDebtAdded = () => {
    refetch();
    setOpenAddDebt(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý công nợ</h1>
        <Button onClick={() => setOpenAddDebt(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Thêm công nợ
        </Button>
      </div>

      <DebtStats />
      
      <div className="mt-6">
        <DebtList 
          debts={debts} 
          isLoading={isLoading} 
          onFilterChange={handleFilterChange}
          onDebtUpdated={refetch}
        />
      </div>

      <AddDebtDialog 
        open={openAddDebt} 
        onOpenChange={setOpenAddDebt}
        onDebtAdded={handleDebtAdded}
      />
    </div>
  );
} 