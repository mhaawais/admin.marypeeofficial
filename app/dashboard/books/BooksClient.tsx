"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { Trash2, Edit, Plus, Upload } from "lucide-react"
import MediaLibrary from "@/components/media-library"

// Update the Book type to match the database column names
type Book = {
  id: string
  title: string
  image: string
  description: string
  createdat?: string // Changed from createdAt
  updatedat?: string // Changed from updatedAt
}

export default function BooksClient() {
  const [books, setBooks] = useState<Book[]>([])
  const [newBook, setNewBook] = useState({ title: "", description: "", image: "" })
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState("")
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books")
      if (!res.ok) throw new Error("Failed to fetch books")
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load books. Please try again.")
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      if (data.url) {
        setNewBook({ ...newBook, image: data.url })
        setPreview(data.url)
      }
    } catch (err) {
      console.error(err)
      setError("Image upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const method = isEditing ? "PUT" : "POST"
      const endpoint = isEditing ? `/api/books/${editingBook?.id}` : "/api/books"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      })

      if (!res.ok) throw new Error("Failed to save book")

      setNewBook({ title: "", description: "", image: "" })
      setPreview("")
      setIsEditing(false)
      setEditingBook(null)
      fetchBooks()
    } catch (err) {
      console.error(err)
      setError("Failed to save book. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (book: Book) => {
    setNewBook({ title: book.title, description: book.description, image: book.image })
    setPreview(book.image)
    setIsEditing(true)
    setEditingBook(book)
    setError("")

    // Scroll to form
    document.getElementById("book-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const cancelEditing = () => {
    setNewBook({ title: "", description: "", image: "" })
    setPreview("")
    setIsEditing(false)
    setEditingBook(null)
    setError("")
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    setError("")
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete book")

      fetchBooks()
    } catch (err) {
      console.error(err)
      setError("Failed to delete book. Please try again.")
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold text-myred mb-6">Manage Books</h1>

        {error && <div className="bg-red-900/30 border border-red-500 text-white p-4 rounded mb-6">{error}</div>}

        {/* Add/Edit Book Form */}
        <form
          id="book-form"
          onSubmit={handleSubmit}
          className="bg-[#111] border border-gray-700 p-6 rounded mb-10 space-y-4 max-w-xl"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? "Edit Book" : "Add New Book"}
          </h2>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Book Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter book title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="w-full p-2 bg-black border border-gray-600 rounded text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter book description"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              className="w-full p-2 bg-black border border-gray-600 rounded text-white"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-300">
              Book Cover Image
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose Image
              </button>
              {uploading && (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-myred"></div>
              )}
            </div>
          </div>

          {preview && (
            <div className="border border-gray-700 rounded p-2">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-contain rounded" />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center gap-2 bg-myred px-6 py-2 rounded text-white hover:bg-red-700 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  {isEditing ? "Saving..." : "Adding..."}
                </>
              ) : (
                <>
                  {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditing ? "Save Changes" : "Add Book"}
                </>
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={cancelEditing}
                className="px-6 py-2 border border-gray-600 rounded text-white hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            )}
          </div>
          {showMediaLibrary && (
            <MediaLibrary
              onSelect={(url: string) => {
                setNewBook({ ...newBook, image: url })
                setPreview(url)
                setShowMediaLibrary(false)
              }}
              onClose={() => setShowMediaLibrary(false)}
              currentImage={newBook.image}
            />
          )}
        </form>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.length === 0 ? (
            <div className="col-span-full bg-[#111] border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-400">No books added yet. Add your first book above.</p>
            </div>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="bg-[#111] border border-gray-700 rounded-lg shadow-lg overflow-hidden transition hover:shadow-xl hover:border-gray-600"
              >
                <div className="relative h-64 overflow-hidden bg-gray-900">
                  <img
                    src={book.image || "/placeholder.svg?height=300&width=200"}
                    alt={book.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{book.title}</h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{book.description}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => startEditing(book)}
                      className="flex items-center gap-1 px-3 py-1 bg-myred text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
