"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { LayoutDashboard, BookOpen, FileText, MessageSquare, User, LogOut, Menu, X, Settings } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Books", href: "/dashboard/books", icon: <BookOpen className="w-5 h-5" /> },
  { label: "Blogs", href: "/dashboard/blogs", icon: <FileText className="w-5 h-5" /> },
  { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" /> },
  { label: "Profile", href: "/dashboard/profile", icon: <User className="w-5 h-5" /> },
  { label: "API Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      signOut({ callbackUrl: "/login" })
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-myred p-2 rounded-md"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Sidebar for desktop and mobile */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen bg-[#111] border-r border-myred
          w-64 p-6
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <h2 className="text-2xl font-bold text-myred mb-10">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                    pathname === item.href ? "bg-myred text-white" : "text-gray-300 hover:bg-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2 rounded text-gray-300 hover:bg-gray-800 transition"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Content padding for mobile */}
      <div className="md:ml-64 transition-all duration-300">{/* Your page content goes here */}</div>
    </>
  )
}
