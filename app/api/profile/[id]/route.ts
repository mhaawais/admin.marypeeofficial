import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logError } from "@/lib/error-logger";

// Define context
interface Context {
  params: Promise<{ id: string }>;
}

// Update user profile
export async function PUT(req: Request, context: Context) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params; // 👈 await here
    const { name, email, bio, image } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, bio, image },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/profile/[id]" });
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}





// import { NextResponse } from "next/server"
// import prisma from "@/lib/db"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth"
// import { logError } from "@/lib/error-logger"

// // Update user profile
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions)
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { id } = params
//     const { name, email, bio, image } = await req.json()

//     if (!name || !email) {
//       return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
//     }

//     const user = await prisma.user.update({
//       where: { id },
//       data: { name, email, bio, image },
//     })

//     // Don't return the password
//     const { password, ...userWithoutPassword } = user

//     return NextResponse.json(userWithoutPassword)
//   } catch (error) {
//     const errorDetails = logError(error, { route: "/api/profile/[id]" })
//     return NextResponse.json(
//       {
//         error: "Failed to update profile",
//         details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }
