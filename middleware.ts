import { NextRequest, NextResponse } from "next/server";

// Gates /admin and /api/admin — this storefront is public-facing and holds
// customer emails/addresses/photos, unlike content-generator's internal-only
// /admin (which is fine unauthenticated because it's never exposed publicly).
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    // Fail closed: if credentials aren't configured, refuse access rather
    // than silently leaving the admin surface open.
    return new NextResponse("Admin auth not configured", { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
    const [providedUser, providedPassword] = decoded.split(":");
    if (providedUser === user && providedPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Kindred Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
