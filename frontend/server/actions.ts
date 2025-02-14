"use server";

import { apiClient } from "@/lib/utils";
import { BaseResponseUserDTO, HttpResponse } from "@/types/Api";
import { cookies, headers } from "next/headers";
import { cache } from "react";

const COOKIE_TOKEN = "token";

export async function setTokenAfterSignIn(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_TOKEN, token, {
    httpOnly: true,
  });
}

export const getMe = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_TOKEN)?.value;
    if (!token) {
      return null;
    }
    const { data, status } = await apiClient.getMe({
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!data.data) {
      return null;
    }
    return { data, status, token };
  } catch (e) {
    const headersList = await headers();
    const host = headersList.get("X-Forwarded-Host");
    const proto = headersList.get("X-Forwarded-Proto");
    await fetch(`${proto}://${host}/api/auth`, {
      method: "POST",
      credentials: "include",
    });
    if (
      (e as HttpResponse<null, BaseResponseUserDTO>)?.error?.errorCode ===
      "TOKEN_EXPIRED"
    ) {
      return {
        data: null,
        status: 401,
      };
    }
    return null;
  }
});

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_TOKEN);
}
