import AuthForm from "@/components/auth-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <AuthForm
        title="Sign Up"
        description="Enter your information to sign up your account"
        type="sign-up"
      >
        <div className="flex justify-center">
          <Link
            href="/auth/sign-in"
            className="underline underline-offset-4 flex text-sm"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </AuthForm>
    </div>
  );
}
