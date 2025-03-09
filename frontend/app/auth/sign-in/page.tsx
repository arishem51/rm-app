import AuthView from "@/components/auth/view";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <AuthView
        title="Đăng Nhập"
        description="Nhập tên người dùng và mật khẩu của bạn để đăng nhập vào tài khoản"
      >
        <div className="flex text-sm justify-center">
          <Link className="underline underline-offset-4" href="/auth/sign-up">
            Chưa có tài khoản? Đăng ký
          </Link>
        </div>
      </AuthView>
    </div>
  );
}
