import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-4xl font-bold ">Welcome to Rice Management App</h1>
        <p className="mt-4 text-lg text-center">
          A comprehensive system designed by{" "}
          <strong>Group 4, FPT University</strong> to manage rice inventory,
          tracking, and sales efficiently.
        </p>
        <div className="mt-6">
          <Button>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
