import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const InventoryPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const id = (await params).id;

  if (isNaN(Number(id))) {
    return (
      <div className="px-4 mt-14">
        <Alert variant="destructive">
          <AlertTitle>Invalid ID</AlertTitle>
          <AlertDescription>The provided ID is not valid.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return "InventoryPage";
};

export default InventoryPage;
