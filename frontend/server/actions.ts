"use server";

import { apiClient } from "@/lib/utils";
import { cookies } from "next/headers";

const COOKIE_TOKEN = "token";

export async function setTokenAfterSignIn(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_TOKEN, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day expiration
    path: "/",
  });
}

export async function getMe() {
  try {
    const token = (await cookies()).get(COOKIE_TOKEN)?.value;
    const { data, status } = await apiClient.api.getMe({
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!data.data) {
      return null;
    }
    return { data, status, token };
  } catch {
    return null;
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_TOKEN);
}
