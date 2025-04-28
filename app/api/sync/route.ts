import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { logError } from "@/lib/error-logger"

// This endpoint will be used by your main website to fetch data
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const apiKey = searchParams.get("apiKey")

    // Validate API key (you should store this securely)
    if (apiKey !== process.env.WEBSITE_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let data

    switch (type) {
      case "books":
        data = await prisma.book.findMany({
          orderBy: { createdAt: "desc" },
        })
        break
      case "blogs":
        data = await prisma.blog.findMany({
          orderBy: { createdAt: "desc" },
        })
        break
      case "profile":
        data = await prisma.user.findFirst({
          select: {
            name: true,
            bio: true,
            image: true,
          },
        })
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/sync" })
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}

// This endpoint will be used to receive contact form submissions from your main website
export async function POST(req: Request) {
  try {
    const { name, email, message, apiKey } = await req.json()

    // Validate API key
    if (apiKey !== process.env.WEBSITE_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save the message to the database
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
      },
    })

    return NextResponse.json({ success: true, id: newMessage.id })
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/sync" })
    return NextResponse.json(
      {
        error: "Failed to save message",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}
