"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { User, Upload } from "lucide-react"
import MediaLibrary from "@/components/media-library"

type Profile = {
  id: string
  name: string
  email: string
  bio: string
  image: string
}

export default function ProfileClient() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState("")
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/profile")

        if (!res.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await res.json()
        setProfile(data)
        setPreview(data.image)
      } catch (err) {
        setError("Error loading profile. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
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
      if (data.url && profile) {
        setProfile({ ...profile, image: data.url })
        setPreview(data.url)
      }
    } catch (err) {
      console.error(err)
      setError("Image upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setMessage("")
    setError("")

    try {
      const res = await fetch(`/api/profile/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      setMessage("Profile updated successfully ✅")

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("")
      }, 3000)
    } catch (err) {
      console.error(err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="ml-0 md:ml-64 p-8 w-full min-h-screen bg-black text-white">
          <h1 className="text-3xl font-bold text-myred mb-6">Edit Profile</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-myred"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="ml-0 md:ml-64 p-8 w-full min-h-screen bg-black text-white">
          <h1 className="text-3xl font-bold text-myred mb-6">Edit Profile</h1>
          <div className="bg-red-900/30 border border-red-500 text-white p-4 rounded">
            {error || "Failed to load profile. Please refresh the page."}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold text-myred mb-6 flex items-center gap-2">
          <User className="w-8 h-8" /> Edit Profile
        </h1>

        {error && <div className="bg-red-900/30 border border-red-500 text-white p-4 rounded mb-6">{error}</div>}

        {message && (
          <div className="bg-green-900/30 border border-green-500 text-white p-4 rounded mb-6">{message}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="md:col-span-1">
            <div className="bg-[#111] border border-gray-700 p-6 rounded space-y-4">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>

              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-myred">
                  <img
                    src={preview || "/placeholder.svg?height=200&width=200"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-4">
                <label htmlFor="profile-image" className="block text-sm font-medium text-gray-300 mb-2">
                  Change Profile Picture
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
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2">
            <form onSubmit={handleSave} className="bg-[#111] border border-gray-700 p-6 rounded space-y-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  id="name"
                  className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600 text-white"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600 text-white"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                  Author Bio
                </label>
                <textarea
                  id="bio"
                  className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600 text-white"
                  rows={5}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="flex items-center gap-2 px-6 py-2 bg-myred hover:bg-red-700 text-white font-semibold rounded transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            </form>
          </div>
        </div>
        {showMediaLibrary && (
          <MediaLibrary
            onSelect={(url: string) => {
              setProfile({ ...profile, image: url })
              setPreview(url)
              setShowMediaLibrary(false)
            }}
            onClose={() => setShowMediaLibrary(false)}
            currentImage={profile.image}
          />
        )}
      </main>
    </div>
  )
}
