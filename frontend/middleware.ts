import { NextRequest, NextResponse } from "next/server";
import { getMe } from "./server/actions";

export async function middleware(request: NextRequest) {
  if (
    request.url.includes("/auth/sign-in") ||
    request.url.includes("/auth/sign-up") ||
    request.url.includes("/auth/forgot-password")
  ) {
    const query = await getMe();
    if (query?.data?.data) {
      return NextResponse.redirect(request.nextUrl.origin + "/dashboard");
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
