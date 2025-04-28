import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log the request path
  console.log(`[Middleware] Request path: ${request.nextUrl.pathname}`)

  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith("/api/sync")) {
    const origin = request.headers.get("origin")

    // You can add more allowed origins as needed
    const allowedOrigins = ["https://marypeeofficial.com", "https://www.marypeeofficial.com"]

    // Check if the request is from an allowed origin
    const isAllowedOrigin = allowedOrigins.includes(origin || "")

    // Create a response object
    const response = NextResponse.next()

    // Set CORS headers
    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin || "")
    } else {
      // For local development or unknown origins, you might want to be more permissive
      // In production, you should restrict this to your known domains
      response.headers.set("Access-Control-Allow-Origin", "*")
    }

    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Max-Age", "86400")

    return response
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
