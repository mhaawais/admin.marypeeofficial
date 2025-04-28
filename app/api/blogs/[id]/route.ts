import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logError } from "@/lib/error-logger";

// Notice: context.params must be awaited
interface Context {
  params: Promise<{ id: string }>;
}

// GET a specific blog
export async function GET(req: Request, context: Context) {
  try {
    const { id } = await context.params; // <-- await here
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/blogs/[id]" });
    return NextResponse.json(
      {
        error: "Failed to fetch blog",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}

// UPDATE a blog
export async function PUT(req: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params; // <-- await here
    const { title, summary, content, image } = await req.json();

    if (!title || !summary || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: { title, summary, content, image: image || "" },
    });

    return NextResponse.json(blog);
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/blogs/[id]" });
    return NextResponse.json(
      {
        error: "Failed to update blog",
        details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE a blog
export async function DELETE(req: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params; // <-- await here

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorDetails = logError(error, { route: "/api/blogs/[id]" });
    return NextResponse.json(
      {
        error: "Failed to delete blog",
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

// // Get a specific blog
// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params
//     const blog = await prisma.blog.findUnique({
//       where: { id },
//     })

//     if (!blog) {
//       return NextResponse.json({ error: "Blog not found" }, { status: 404 })
//     }

//     return NextResponse.json(blog)
//   } catch (error) {
//     const errorDetails = logError(error, { route: "/api/blogs/[id]" })
//     return NextResponse.json(
//       {
//         error: "Failed to fetch blog",
//         details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// // Update a blog
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions)
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { id } = params
//     const { title, summary, content, image } = await req.json()

//     if (!title || !summary || !content) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     const blog = await prisma.blog.update({
//       where: { id },
//       data: { title, summary, content, image: image || "" },
//     })

//     return NextResponse.json(blog)
//   } catch (error) {
//     const errorDetails = logError(error, { route: "/api/blogs/[id]" })
//     return NextResponse.json(
//       {
//         error: "Failed to update blog",
//         details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// // Delete a blog
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions)
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { id } = params

//     await prisma.blog.delete({
//       where: { id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     const errorDetails = logError(error, { route: "/api/blogs/[id]" })
//     return NextResponse.json(
//       {
//         error: "Failed to delete blog",
//         details: process.env.NODE_ENV !== "production" ? errorDetails : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }
