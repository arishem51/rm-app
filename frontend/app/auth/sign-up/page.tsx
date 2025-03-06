import AuthView from "@/components/auth/view";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <AuthView
        title="Đăng Ký"
        description="Nhập thông tin của bạn để đăng ký tài khoản"
        type="sign-up"
      >
        <div className="flex justify-center">
          <Link
            href="/auth/sign-in"
            className="underline underline-offset-4 flex text-sm"
          >
            Đã có tài khoản? Đăng Nhập
          </Link>
        </div>
      </AuthView>
    </div>
  );
}
