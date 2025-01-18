"use server";

import { cookies } from "next/headers";

const COOKIE_TOKEN = "token";

export async function signIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await fetch("http://localhost:8080/api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  const data: BaseResponse<AuthResponse> = await res.json();
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
  console.log(response);
  if (!response.data) {
    return null;
  }
  return response;
}
