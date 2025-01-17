import AuthForm from "@/components/auth-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <AuthForm
        title="Sign In"
        description="Enter your username and password to sign in to your account"
      >
        <div className="flex text-sm justify-between">
          <span>Don&apos;t have an account?</span>
          <Link className="underline underline-offset-4" href="/auth/sign-up">
            Sign up
          </Link>
        </div>
      </AuthForm>
    </div>
  );
}
