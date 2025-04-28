"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"

type Message = {
  id: string
  name: string
  email: string
  message: string
  createdAt: string // Changed to match database column name
}

export default function MessageClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/messages")

        if (!res.ok) {
          throw new Error("Failed to fetch messages")
        }

        const data = await res.json()
        setMessages(data)
      } catch (err) {
        setError("Error loading messages. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete message")
      }

      // Remove the deleted message from state
      setMessages(messages.filter((msg) => msg.id !== id))
    } catch (err) {
      setError("Error deleting message. Please try again.")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
          <h1 className="text-3xl font-bold text-myred mb-6">Inbox Messages</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-myred"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
          <h1 className="text-3xl font-bold text-myred mb-6">Inbox Messages</h1>
          <div className="bg-red-900/30 border border-red-500 text-white p-4 rounded">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold text-myred mb-6">Inbox Messages</h1>

        {messages.length === 0 ? (
          <div className="bg-[#111] border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">No messages yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#111] border border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-myred">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-myred">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-myred">Message</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-myred">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-myred">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-900/50">
                    <td className="px-6 py-4 text-sm text-white">{msg.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{msg.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {msg.message.length > 100 ? `${msg.message.substring(0, 100)}...` : msg.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:text-red-400">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
