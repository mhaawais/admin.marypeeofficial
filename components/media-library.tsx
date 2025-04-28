// components/media-library.tsx
"use client"

import { useState, useEffect } from "react"
import { X, Upload, Search, Trash2, Check } from 'lucide-react'

// Define the props interface
export interface MediaLibraryProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  currentImage?: string;
}

type MediaItem = {
  id: string;
  url: string;
  public_id: string;
  createdAt: string;
}

export default function MediaLibrary({ onSelect, onClose, currentImage }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(currentImage || "");

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Failed to fetch media");
      const data = await res.json();
      setMedia(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load media. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (data.url) {
        setMedia([
          { id: Date.now().toString(), url: data.url, public_id: data.public_id, createdAt: new Date().toISOString() },
          ...media,
        ]);
        setSelectedImage(data.url);
      }
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (!res.ok) throw new Error("Failed to delete image");

      setMedia(media.filter((item) => item.url !== url));
      if (selectedImage === url) {
        setSelectedImage("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete image. Please try again.");
    }
  };

  const filteredMedia = media.filter((item) => item.url.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Media Library</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            />
          </div>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
            <button
              className={`flex items-center gap-2 px-4 py-2 bg-myred text-white rounded ${
                uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
              }`}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>

        {error && <div className="p-4 text-red-400">{error}</div>}

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-myred"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              {searchTerm ? "No images match your search" : "No images uploaded yet"}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className={`relative group aspect-square bg-gray-800 rounded-md overflow-hidden border-2 ${
                    selectedImage === item.url ? "border-myred" : "border-transparent"
                  }`}
                >
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt="Media"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(item.url)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDelete(item.public_id, item.url)}
                      className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {selectedImage === item.url && (
                    <div className="absolute top-2 right-2 bg-myred rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={() => onSelect(selectedImage)}
            disabled={!selectedImage}
            className={`px-6 py-2 bg-myred text-white rounded ${
              !selectedImage ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  );
}




// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useState } from "react"
// import { signOut } from "next-auth/react"
// import { LayoutDashboard, BookOpen, FileText, MessageSquare, User, LogOut, Menu, X, Settings } from "lucide-react"

// const navItems = [
//   { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
//   { label: "Books", href: "/dashboard/books", icon: <BookOpen className="w-5 h-5" /> },
//   { label: "Blogs", href: "/dashboard/blogs", icon: <FileText className="w-5 h-5" /> },
//   { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" /> },
//   { label: "Profile", href: "/dashboard/profile", icon: <User className="w-5 h-5" /> },
//   { label: "API Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
// ]

// export default function Sidebar() {
//   const pathname = usePathname()
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen)
//   }

//   const handleSignOut = () => {
//     if (confirm("Are you sure you want to sign out?")) {
//       signOut({ callbackUrl: "/login" })
//     }
//   }


//   return (
//     <>
//       {/* Mobile menu button */}
//       <button
//         onClick={toggleMobileMenu}
//         className="md:hidden fixed top-4 left-4 z-50 bg-myred p-2 rounded-md"
//         aria-label="Toggle menu"
//       >
//         {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
//       </button>

//       {/* Sidebar for desktop and mobile */}
//       <aside
//         className={`
//           fixed left-0 top-0 z-40 h-screen bg-[#111] border-r border-myred
//           w-64 p-6
//           transform transition-transform duration-300 ease-in-out
//           md:translate-x-0
//           ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         <h2 className="text-2xl font-bold text-myred mb-10">Admin Panel</h2>
//         <nav>
//           <ul className="space-y-4">
//             {navItems.map((item) => (
//               <li key={item.href}>
//                 <Link
//                   href={item.href}
//                   className={`flex items-center gap-3 px-4 py-2 rounded transition ${
//                     pathname === item.href ? "bg-myred text-white" : "text-gray-300 hover:bg-gray-800"
//                   }`}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   {item.icon}
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//             <li className="pt-4 border-t border-gray-700">
//               <button
//                 onClick={handleSignOut}
//                 className="flex items-center gap-3 w-full px-4 py-2 rounded text-gray-300 hover:bg-gray-800 transition"
//               >
//                 <LogOut className="w-5 h-5" />
//                 Sign Out
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Overlay for mobile */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Content padding for mobile */}
//       <div className="md:ml-64 transition-all duration-300">{/* Your page content goes here */}</div>
//     </>
//   )
// }
