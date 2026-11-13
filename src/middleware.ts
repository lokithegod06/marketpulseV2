import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Allow public marketing page, pricing, login, register, and interactive demo exploration
  // When strict auth mode is enabled via ENFORCE_AUTH=true, unauthenticated users are redirected to /login
  const enforceAuth = process.env.ENFORCE_AUTH === "true"
  if (!enforceAuth) {
    return NextResponse.next()
  }

  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("next-auth.session-token")

  const pathname = req.nextUrl.pathname
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/journal") ||
    pathname.startsWith("/discipline") ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/screeners") ||
    pathname.startsWith("/watchlist") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/algo-bots") ||
    pathname.startsWith("/experts")

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
