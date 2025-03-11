import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const UnSupportRole = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="text-xl font-bold mt-1">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-gray-500 ">
            Please contact your administrator if you believe this is a mistake.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnSupportRole;
