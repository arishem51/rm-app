"use client"; // Error boundaries must be Client Components
import { globalStore } from "@/store";
import { userAtom } from "@/store/user";
import { useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
export default function Error({ error }: { error: Error }) {
  console.log("error", error);
  const queryClient = useQueryClient();
  queryClient.clear();
  globalStore.set(userAtom, {
    token: "",
    user: undefined,
    showToastErrorSignIn: true,
  });
  redirect("/auth/sign-in");
}
