import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { logError } from "@/lib/error-logger"

// Get all messages
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(messages)
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/messages" })
    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}
