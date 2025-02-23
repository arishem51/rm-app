import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const UnSupportFeature = () => {
  return (
    <div className="flex mt-14 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Feature Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            We haven&apos;t supported this feature yet.
          </p>
          <p className="text-center text-gray-500 mt-2">
            Please check back later for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnSupportFeature;
