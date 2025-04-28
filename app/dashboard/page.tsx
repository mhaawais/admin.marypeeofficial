import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import Sidebar from "@/components/sidebar"
import Link from "next/link"
import { BookOpen, FileText, MessageSquare, User, ExternalLink } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get counts
  const booksCount = await prisma.book.count()
  const blogsCount = await prisma.blog.count()
  const messagesCount = await prisma.message.count()
  const latestMessages = await prisma.message.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold text-myred mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/books"
            className="bg-[#111] border border-gray-700 p-6 rounded-lg hover:border-myred transition flex flex-col items-center text-center"
          >
            <BookOpen className="w-12 h-12 text-myred mb-4" />
            <h2 className="text-xl font-semibold mb-2">Books</h2>
            <p className="text-3xl font-bold">{booksCount}</p>
            <p className="text-gray-400 mt-2">Manage your published books</p>
          </Link>

          <Link
            href="/dashboard/blogs"
            className="bg-[#111] border border-gray-700 p-6 rounded-lg hover:border-myred transition flex flex-col items-center text-center"
          >
            <FileText className="w-12 h-12 text-myred mb-4" />
            <h2 className="text-xl font-semibold mb-2">Blogs</h2>
            <p className="text-3xl font-bold">{blogsCount}</p>
            <p className="text-gray-400 mt-2">Manage your blog posts</p>
          </Link>

          <Link
            href="/dashboard/messages"
            className="bg-[#111] border border-gray-700 p-6 rounded-lg hover:border-myred transition flex flex-col items-center text-center"
          >
            <MessageSquare className="w-12 h-12 text-myred mb-4" />
            <h2 className="text-xl font-semibold mb-2">Messages</h2>
            <p className="text-3xl font-bold">{messagesCount}</p>
            <p className="text-gray-400 mt-2">View contact form submissions</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-myred" /> Recent Messages
            </h2>
            {latestMessages.length === 0 ? (
              <p className="text-gray-400">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {latestMessages.map((msg) => (
                  <div key={msg.id} className="border-b border-gray-700 pb-3">
                    <div className="flex justify-between">
                      <p className="font-semibold">{msg.name}</p>
                      <p className="text-sm text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-gray-300 text-sm">{msg.email}</p>
                    <p className="text-gray-400 mt-1 line-clamp-2">{msg.message}</p>
                  </div>
                ))}
                <Link
                  href="/dashboard/messages"
                  className="text-myred hover:text-red-400 flex items-center gap-1 text-sm"
                >
                  View all messages <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          <div className="bg-[#111] border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-myred" /> Website Integration
            </h2>
            <p className="text-gray-300 mb-4">
              Connect your admin panel with your main website at{" "}
              <a
                href="https://marypeeofficial.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-myred hover:underline"
              >
                marypeeofficial.com
              </a>
            </p>

            <div className="bg-gray-800 p-4 rounded-md mb-4">
              <h3 className="font-semibold mb-2">API Endpoints</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <code className="bg-gray-900 px-2 py-1 rounded">GET /api/sync?type=books&apiKey=YOUR_API_KEY</code>
                  <p className="mt-1 text-gray-400">Fetch all books</p>
                </li>
                <li>
                  <code className="bg-gray-900 px-2 py-1 rounded">GET /api/sync?type=blogs&apiKey=YOUR_API_KEY</code>
                  <p className="mt-1 text-gray-400">Fetch all blogs</p>
                </li>
                <li>
                  <code className="bg-gray-900 px-2 py-1 rounded">GET /api/sync?type=profile&apiKey=YOUR_API_KEY</code>
                  <p className="mt-1 text-gray-400">Fetch author profile</p>
                </li>
                <li>
                  <code className="bg-gray-900 px-2 py-1 rounded">POST /api/sync</code>
                  <p className="mt-1 text-gray-400">Submit contact form messages</p>
                </li>
              </ul>
            </div>

            <Link href="/dashboard/settings" className="text-myred hover:text-red-400 flex items-center gap-1 text-sm">
              Configure API settings <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
