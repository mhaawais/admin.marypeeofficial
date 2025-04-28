import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logError } from "@/lib/error-logger";

// Define context type
interface Context {
  params: Promise<{ id: string }>;
}

// Delete a message
export async function DELETE(req: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params; // 👈 await here

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/messages/[id]" });
    return NextResponse.json(
      {
        error: "Failed to delete message",
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

// // Delete a message
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions)
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { id } = params

//     if (!id) {
//       return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
//     }

//     await prisma.message.delete({
//       where: { id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     const errorDetails = logError(error, { route: "/api/messages/[id]" })
//     return NextResponse.json(
//       {
//         error: "Failed to delete message",
//         details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }
