"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 text-center">
      <h1 className="text-4xl font-bold text-myred mb-4">Something went wrong</h1>
      <p className="text-lg text-gray-300 max-w-2xl mb-6">We apologize for the inconvenience. An error has occurred.</p>
      <div className="bg-gray-800 p-4 rounded-md mb-6 max-w-xl overflow-auto text-left">
        <p className="text-red-400 font-mono">{error.message || "Unknown error"}</p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-myred text-white rounded shadow hover:bg-red-700 transition"
        >
          Try again
        </button>
        <Link href="/" className="px-6 py-2 bg-gray-700 text-white rounded shadow hover:bg-gray-600 transition">
          Go to Home
        </Link>
      </div>
    </div>
  )
}
