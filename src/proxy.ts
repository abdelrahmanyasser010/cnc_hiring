// src/proxy.ts
// Middleware: Route protection using unified NextAuth JWT (ADR-001, ADR-002)
// No more candidate_session cookie — all roles share one auth system

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ── Route Groups ────────────────────────────────────────────────────────────
  const isDashboardRoute = path.startsWith("/dashboard");
  const isAdminRoute = path.startsWith("/admin");
  const isTalentRoute = path.startsWith("/talent");
  const isNewJobRoute = path === "/jobs/new";
  const isCandidateRoute = path.startsWith("/candidate") && path !== "/candidate/login" && path !== "/candidate/register";
  const isBillingRoute = path.startsWith("/billing");

  const requiresAuth =
    isDashboardRoute ||
    isAdminRoute ||
    isTalentRoute ||
    isNewJobRoute ||
    isCandidateRoute ||
    isBillingRoute;

  // ── 1. Auth Guard ────────────────────────────────────────────────────────────
  if (requiresAuth && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // ── 2. Suspended / Banned Guard ──────────────────────────────────────────────
  if (token && (token.status === "SUSPENDED" || token.status === "BANNED")) {
    return NextResponse.redirect(new URL("/account-suspended", request.url));
  }

  // ── 3. Admin-only Guard ──────────────────────────────────────────────────────
  if (isAdminRoute && token && token.role !== "SUPER_ADMIN" && token.role !== "SUPPORT_AGENT") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 4. Candidate Portal Guard ────────────────────────────────────────────────
  // Only CANDIDATE role can access /candidate/* routes
  if (isCandidateRoute && token && token.role !== "CANDIDATE") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 5. Employer-only Routes Guard ────────────────────────────────────────────
  // /talent, /jobs/new, /billing → only for EMPLOYER or SUPER_ADMIN
  if ((isTalentRoute || isNewJobRoute || isBillingRoute) && token) {
    if (token.role !== "EMPLOYER" && token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/candidate/profile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/talent/:path*",
    "/jobs/new",
    "/billing/:path*",
    "/candidate/:path*",
  ],
};
