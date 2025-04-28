"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Critical Error</h1>
          <p className="text-lg text-gray-300 max-w-2xl mb-6">
            The application encountered a critical error and cannot continue.
          </p>
          <div className="bg-gray-800 p-4 rounded-md mb-6 max-w-xl overflow-auto text-left">
            <p className="text-red-400 font-mono">{error.message || "Unknown error"}</p>
          </div>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
