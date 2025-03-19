import AuthView from "@/components/auth/view";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col justify-center py-6">
      <AuthView
        title="Đăng Ký"
        description="Nhập thông tin của bạn để đăng ký tài khoản"
        type="sign-up"
        enableReCaptcha
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
