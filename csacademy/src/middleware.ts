import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES  = ["/", "/programs", "/ai-tools", "/cybersecurity", "/pricing", "/about"];
const AUTH_ROUTES    = ["/login", "/register"];
const STUDENT_PREFIX = "/student";
const INSTRUCTOR_PREFIX = "/instructor";
const ADMIN_PREFIX   = "/admin";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Public routes — always accessible
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith("/api/public"))) {
    return supabaseResponse;
  }

  // Auth routes — redirect authenticated users to dashboard
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (user) return NextResponse.redirect(new URL("/student/dashboard", request.url));
    return supabaseResponse;
  }

  // Protected routes — require authentication
  if (
    pathname.startsWith(STUDENT_PREFIX) ||
    pathname.startsWith(INSTRUCTOR_PREFIX) ||
    pathname.startsWith(ADMIN_PREFIX)
  ) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
