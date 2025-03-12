import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AlertErrorDetailPage = () => {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong</AlertDescription>
    </Alert>
  );
};

export default AlertErrorDetailPage;
