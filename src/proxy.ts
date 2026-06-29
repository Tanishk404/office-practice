import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Agar user '/admin' ke kisi bhi route par jana chahta hai
  if (pathname.startsWith("/admin")) {
    if (!token) {
      // Agar token nahi hai, toh login page par bhej do
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Login page par pehle se log-in user ko na aane dein (Optional)
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Config: batayein ki middleware kahan-kahan chale
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};