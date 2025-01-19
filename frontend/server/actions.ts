"use server";

import { apiClient } from "@/lib/utils";
import { cookies } from "next/headers";

const COOKIE_TOKEN = "token";

export async function signIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await apiClient.api.signIn({ username, password });

  if (!res.ok) throw new Error("Invalid credentials");

  const data = await res.json();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_TOKEN, data.data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day expiration
    path: "/",
  });
  return data;
}

export async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const response = await fetch("http://localhost:8080/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (res) => {
    return res.json();
  });
  if (!response.data) {
    return null;
  }
  return response;
}
