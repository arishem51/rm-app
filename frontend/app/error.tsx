"use client"; // Error boundaries must be Client Components
import { globalStore } from "@/store";
import { authAtom } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function ErrorPage({ error }: { error: Error }) {
  console.log("error", error);
  const queryClient = useQueryClient();
  queryClient.clear();
  globalStore.set(authAtom, {
    token: "",
    user: undefined,
    showToastErrorSignIn: true,
  });
  redirect("/auth/sign-in");
}
