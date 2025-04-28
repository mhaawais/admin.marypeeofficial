import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { logError } from "@/lib/error-logger"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Get all media
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get images from Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.search
        .expression("folder:marypee-official")
        .sort_by("created_at", "desc")
        .max_results(100)
        .execute()
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    })

    // Format the response
    const media = (result as any).resources.map((resource: any) => ({
      id: resource.asset_id,
      url: resource.secure_url,
      public_id: resource.public_id,
      createdAt: resource.created_at,
    }))

    return NextResponse.json(media)
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/media" })
    return NextResponse.json(
      {
        error: "Failed to fetch media",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}

// Delete media
export async function DELETE(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { public_id } = await req.json()

    if (!public_id) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error: Error | null, result: any) => {
        if (error) reject(error)
        else resolve(result)
      })
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/media" })
    return NextResponse.json(
      {
        error: "Failed to delete media",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}
