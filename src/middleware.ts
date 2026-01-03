import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // if user is logged in and tries auth pages → redirect to dashboard
  if (
    token &&
    (pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/verify") ||
      pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"],
};
