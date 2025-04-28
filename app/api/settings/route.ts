import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { randomBytes } from "crypto"
import { logError } from "@/lib/error-logger"

// In a real application, you would store this in a database
// For simplicity, we're using an environment variable
let apiKey = process.env.WEBSITE_API_KEY || ""

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ apiKey })
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/settings" })
    return NextResponse.json(
      {
        error: "Failed to fetch settings",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    if (body.action === "generateApiKey") {
      // Generate a new API key
      apiKey = randomBytes(32).toString("hex")
      // In a real application, you would save this to a database
      // For now, we'll just return it
      return NextResponse.json({ apiKey })
    }

    if (body.apiKey) {
      // Update the API key
      apiKey = body.apiKey
      // In a real application, you would save this to a database
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/settings" })
    return NextResponse.json(
      {
        error: "Failed to update settings",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}
