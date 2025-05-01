import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// This is a secret key that should be different from your API key
// It's used specifically for this rebuild endpoint
const REBUILD_SECRET = process.env.REBUILD_SECRET

export async function POST(req: Request) {
  try {
    // First, check if the user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Log the rebuild request
    console.log("Rebuild requested at", new Date().toISOString())

    // Check if the REBUILD_SECRET is set
    if (!REBUILD_SECRET) {
      console.error("REBUILD_SECRET environment variable is not set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // In a real-world scenario, you would trigger your deployment script here
    // For example, you could use a webhook to trigger a GitHub Action
    // or run your deployment script directly if this server has access to Hostinger

    // For demonstration, we'll just log a success message
    // In a real implementation, you would replace this with actual deployment code
    console.log("Rebuild would be triggered here with secret:", REBUILD_SECRET.substring(0, 3) + "...")

    return NextResponse.json({ success: true, message: "Rebuild triggered" })
  } catch (error) {
    console.error("Error triggering rebuild:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to trigger rebuild",
      },
      { status: 500 },
    )
  }
}






// import { NextResponse } from "next/server"
// import { exec } from "child_process"
// import { promisify } from "util"

// const execAsync = promisify(exec)

// // This is a secret key that should be different from your API key
// // It's used specifically for this rebuild endpoint
// const REBUILD_SECRET = process.env.REBUILD_SECRET

// export async function POST(req: Request) {
//   try {
//     // Get the secret from the request
//     const { secret } = await req.json()

//     // Validate the secret
//     if (secret !== REBUILD_SECRET) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Log the rebuild request
//     console.log("Rebuild requested at", new Date().toISOString())

//     // In a real-world scenario, you would trigger your deployment script here
//     // For example, you could use a webhook to trigger a GitHub Action
//     // or run your deployment script directly if this server has access to Hostinger

//     // For demonstration, we'll just log a success message
//     // In a real implementation, you would replace this with actual deployment code
//     console.log("Rebuild would be triggered here")

//     return NextResponse.json({ success: true, message: "Rebuild triggered" })
//   } catch (error) {
//     console.error("Error triggering rebuild:", error)
//     return NextResponse.json({ error: "Failed to trigger rebuild" }, { status: 500 })
//   }
// }
