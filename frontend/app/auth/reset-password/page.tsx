import ResetPasswordView from "@/components/dashboard/reset-password";
import { redirect } from "next/navigation";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const token = (await searchParams)?.token;

  if (!token) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="h-screen flex flex-col justify-center">
      <ResetPasswordView token={token as string} />
    </div>
  );
};

export default ResetPasswordPage;
