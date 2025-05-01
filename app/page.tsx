import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 text-center">
      <h1 className="text-4xl font-bold text-myred mb-4">Welcome to Marypee Official Admin Panel</h1>
      <p className="text-lg text-gray-300 max-w-2xl mb-8">
        This is the private site for Mary Pat Uzoma to manage books and blogs.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-myred text-white rounded-md shadow hover:bg-red-700 transition text-center"
        > 
          Login to Admin Panel
        </Link>
        <Link
          href="/debug"
          className="px-6 py-3 bg-gray-700 text-white rounded-md shadow hover:bg-gray-600 transition text-center"
        >
          System Diagnostics
        </Link>
      </div>
    </main>
  )
}
