"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkApi() {
      try {
        setLoading(true)
        const res = await fetch("/api/debug")
        const data = await res.json()
        setApiStatus(data)
        setError(null)
      } catch (err) {
        console.error("Debug check failed:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    checkApi()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-myred mb-6">System Diagnostics</h1>

        <div className="mb-8">
          <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Status Check</h2>

          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-myred"></div>
              <span>Checking API status...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-500 p-4 rounded-md">
              <p className="font-semibold text-red-400">Error checking API:</p>
              <p className="font-mono text-sm mt-2">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${apiStatus?.status === "API is working" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="font-semibold">{apiStatus?.status}</span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Authentication:</h3>
                <div className="bg-gray-800 p-3 rounded-md">
                  <p>{apiStatus?.auth?.session}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Environment Variables:</h3>
                <div className="bg-gray-800 p-3 rounded-md">
                  <ul className="space-y-1">
                    {apiStatus?.environment &&
                      Object.entries(apiStatus.environment).map(([key, value]) => (
                        <li key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className={value === "✅ Set" ? "text-green-400" : "text-red-400"}>
                            {String(value)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {apiStatus?.error && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2 text-red-400">Error Details:</h3>
                  <div className="bg-red-900/30 border border-red-500 p-3 rounded-md">
                    <p className="font-mono text-sm">{apiStatus.error}</p>
                    {apiStatus.details && (
                      <pre className="mt-2 overflow-x-auto text-xs">{JSON.stringify(apiStatus.details, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Check that all environment variables are properly set</li>
            <li>Verify database connection string is correct</li>
            <li>Ensure Cloudinary credentials are valid</li>
            <li>Check for any TypeScript or build errors</li>
            <li>Clear browser cache and cookies</li>
            <li>Try accessing the site in an incognito/private window</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
