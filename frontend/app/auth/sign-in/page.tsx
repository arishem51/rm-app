import AuthView from "@/components/auth/view";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <AuthView
        title="Sign In"
        description="Enter your username and password to sign in to your account"
      >
        <div className="flex text-sm justify-center">
          <Link className="underline underline-offset-4" href="/auth/sign-up">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </AuthView>
    </div>
  );
}
