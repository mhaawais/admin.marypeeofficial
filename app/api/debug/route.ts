import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { logError } from "@/lib/error-logger"
import { checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  try {
    // Check if we can get the session
    const session = await getServerSession(authOptions)

    // Check database connection
    const dbStatus = await checkDatabaseConnection()

    // Check environment variables
    const envCheck = {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
    }

    return NextResponse.json({
      status: "API is working",
      auth: {
        session: session ? "✅ Session found" : "❌ No session",
      },
      database: dbStatus.connected ? "✅ Connected" : `❌ Connection failed: ${dbStatus.error}`,
      environment: envCheck,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/debug" })

    return NextResponse.json(
      {
        status: "API error",
        error: errorDetails.message,
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}
