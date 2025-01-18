import { LoaderCircle } from "lucide-react";

export const LoadingFullScreen = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
      <LoaderCircle className="w-12 h-12 animate-spin text-gray-500" />
    </div>
  );
};
