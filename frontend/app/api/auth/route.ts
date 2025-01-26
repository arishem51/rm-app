import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return new Response("Success");
}
