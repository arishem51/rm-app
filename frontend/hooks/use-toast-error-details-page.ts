import { toast } from "@/hooks/use-toast";
import { ToastTitle } from "@/lib/constants";
import { HttpErrorResponse } from "@/types";
import { useEffect } from "react";

const useToastErrorDetailsPage = (error?: Error | null) => {
  useEffect(() => {
    const stackError = (error as unknown as HttpErrorResponse)?.error;
    if (stackError?.message) {
      toast({
        title: ToastTitle.error,
        description: stackError.message,
        variant: "destructive",
      });
    }
  }, [error]);
};

export default useToastErrorDetailsPage;
