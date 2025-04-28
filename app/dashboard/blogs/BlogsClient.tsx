"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { Trash2, Edit, Plus, Upload } from "lucide-react"
// Import the MediaLibrary component
import MediaLibrary from "@/components/media-library"

// Update the Blog type to match the database column names
type Blog = {
  id: string
  title: string
  summary: string
  content: string
  image: string
  createdat?: string // Changed from createdAt
}

export default function BlogsClient() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [newBlog, setNewBlog] = useState({ title: "", summary: "", content: "", image: "" })
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState("")
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  // Add state for media library visibility
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs")
      if (!res.ok) throw new Error("Failed to fetch blogs")
      const data = await res.json()
      setBlogs(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load blogs. Please try again.")
    }
  }

  useEffect(() => {
    fetchBlogs()
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
        setNewBlog({ ...newBlog, image: data.url })
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
      const endpoint = isEditing ? `/api/blogs/${editingBlog?.id}` : "/api/blogs"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog),
      })

      if (!res.ok) throw new Error("Failed to save blog")

      setNewBlog({ title: "", summary: "", content: "", image: "" })
      setPreview("")
      setIsEditing(false)
      setEditingBlog(null)
      fetchBlogs()
    } catch (err) {
      console.error(err)
      setError("Failed to save blog. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (blog: Blog) => {
    setNewBlog({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      image: blog.image,
    })
    setPreview(blog.image)
    setIsEditing(true)
    setEditingBlog(blog)
    setError("")

    // Scroll to form
    document.getElementById("blog-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const cancelEditing = () => {
    setNewBlog({ title: "", summary: "", content: "", image: "" })
    setPreview("")
    setIsEditing(false)
    setEditingBlog(null)
    setError("")
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    setError("")
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete blog")

      fetchBlogs()
    } catch (err) {
      console.error(err)
      setError("Failed to delete blog. Please try again.")
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold text-myred mb-6">Manage Blogs</h1>

        {error && <div className="bg-red-900/30 border border-red-500 text-white p-4 rounded mb-6">{error}</div>}

        {/* Add/Edit Blog Form */}
        <form
          id="blog-form"
          onSubmit={handleSubmit}
          className="bg-[#111] border border-gray-700 p-6 rounded mb-10 space-y-4 max-w-xl"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? "Edit Blog" : "Add New Blog"}
          </h2>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter blog title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className="w-full p-2 bg-black border border-gray-600 rounded text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-300">
              Summary
            </label>
            <textarea
              id="summary"
              placeholder="Enter blog summary"
              value={newBlog.summary}
              onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
              className="w-full p-2 bg-black border border-gray-600 rounded text-white"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300">
              Content
            </label>
            <textarea
              id="content"
              placeholder="Enter blog content"
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              className="w-full p-2 bg-black border border-gray-600 rounded text-white"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-300">
              Featured Image
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

          {showMediaLibrary && (
            <MediaLibrary
              onSelect={(url: string) => {
                setNewBlog({ ...newBlog, image: url })
                setPreview(url)
                setShowMediaLibrary(false)
              }}
              onClose={() => setShowMediaLibrary(false)}
              currentImage={newBlog.image}
            />
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
                  {isEditing ? "Save Changes" : "Add Blog"}
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
        </form>

        {/* Blog List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {blogs.length === 0 ? (
            <div className="col-span-full bg-[#111] border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-400">No blogs added yet. Add your first blog above.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-[#111] border border-gray-700 rounded-lg shadow-lg overflow-hidden transition hover:shadow-xl hover:border-gray-600"
              >
                <div className="relative h-52 overflow-hidden bg-gray-900">
                  <img
                    src={blog.image || "/placeholder.svg?height=300&width=200"}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{blog.title}</h2>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{blog.summary}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => startEditing(blog)}
                      className="flex items-center gap-1 px-3 py-1 bg-myred text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
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
