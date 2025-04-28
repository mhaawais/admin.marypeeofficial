import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { logError } from "@/lib/error-logger"

// Get a specific book
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const book = await prisma.book.findUnique({
      where: { id },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/books/[id]" })
    return NextResponse.json(
      {
        error: "Failed to fetch book",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}

// Update a book
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { title, description, image } = await req.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const book = await prisma.book.update({
      where: { id },
      data: { title, description, image: image || "" },
    })

    return NextResponse.json(book)
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/books/[id]" })
    return NextResponse.json(
      {
        error: "Failed to update book",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}

// Delete a book
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await prisma.book.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/books/[id]" })
    return NextResponse.json(
      {
        error: "Failed to delete book",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}
