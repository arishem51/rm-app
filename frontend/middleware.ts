import { NextRequest, NextResponse } from "next/server";
import { getMe } from "./server/actions";
import { AppRoutes } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { signIn, signUp, forgotPassword, resetPassword } = AppRoutes.auth;
  const checkIncludes = (url: string) => request.url.includes(url);
  const isAuthRoute =
    checkIncludes(signIn.url) ||
    checkIncludes(signUp.url) ||
    checkIncludes(forgotPassword.url) ||
    checkIncludes(resetPassword.url);

  if (isAuthRoute) {
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
