import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getMe } from "./server/actions";

export async function middleware(request: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (
    token &&
    (request.url.includes("/auth/sign-in") ||
      request.url.includes("/auth/sign-up"))
  ) {
    const me = await getMe();
    if (me?.data) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
