import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, origin } = request?.nextUrl;
  const session = request?.cookies.get("Bearer");
  if (pathname.includes("/admin")) {
    if (!session) return NextResponse.redirect(`${origin}/login`);
  }
}