"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import { Copy, Check, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Fetch the current API key
    const fetchApiKey = async () => {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          if (data.apiKey) {
            setApiKey(data.apiKey)
          }
        }
      } catch (error) {
        console.error("Error fetching API key:", error)
      }
    }

    fetchApiKey()
  }, [])

  const generateNewApiKey = async () => {
    if (!confirm("Are you sure you want to generate a new API key? This will invalidate the old one.")) {
      return
    }

    setGenerating(true)
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "generateApiKey" }),
      })

      if (res.ok) {
        const data = await res.json()
        setApiKey(data.apiKey)
      }
    } catch (error) {
      console.error("Error generating API key:", error)
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveSettings = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold text-myred mb-6">API Settings</h1>

        <div className="max-w-2xl">
          <div className="bg-[#111] border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Website Integration</h2>
            <p className="text-gray-300 mb-6">
              Use this API key to connect your main website to this admin panel. Keep this key secret and secure.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                <div className="flex">
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l text-white"
                    readOnly
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-r hover:bg-gray-600 transition"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={generateNewApiKey}
                  disabled={generating}
                  className="flex items-center gap-2 px-4 py-2 bg-myred hover:bg-red-700 rounded text-white transition disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" /> Generate New Key
                    </>
                  )}
                </button>

                <button
                  onClick={saveSettings}
                  className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition ${
                    saved ? "bg-green-700 hover:bg-green-600" : ""
                  }`}
                >
                  {saved ? "Saved!" : "Save Settings"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Integration Guide</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Add the API Key to Your Website</h3>
                <p className="text-gray-300 mb-2">
                  Store this API key securely in your website's environment variables or configuration.
                </p>
                <div className="bg-gray-800 p-3 rounded-md">
                  <code className="text-sm">ADMIN_API_KEY=your_api_key_here</code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">2. Fetch Data from the Admin Panel</h3>
                <p className="text-gray-300 mb-2">Example code to fetch books from your website:</p>
                <div className="bg-gray-800 p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`async function fetchBooks() {
  const response = await fetch(
    'https://your-admin-panel-url.com/api/sync?type=books&apiKey=your_api_key_here'
  );
  const books = await response.json();
  return books;
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">3. Send Contact Form Submissions</h3>
                <p className="text-gray-300 mb-2">Example code to send contact form submissions:</p>
                <div className="bg-gray-800 p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`async function submitContactForm(formData) {
  const response = await fetch(
    'https://your-admin-panel-url.com/api/sync', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        apiKey: 'your_api_key_here'
      }),
    }
  );
  return await response.json();
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
