import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AlertInvalidId = () => {
  return (
    <div className="px-4 mt-14">
      <Alert variant="destructive">
        <AlertTitle>Invalid ID</AlertTitle>
        <AlertDescription>The provided ID is not valid.</AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertInvalidId;
