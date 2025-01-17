import AuthForm from "@/components/auth-form";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <AuthForm
        title="Sign Up"
        description="Enter your information to sign up your account"
        type="sign-up"
      ></AuthForm>
    </div>
  );
}
