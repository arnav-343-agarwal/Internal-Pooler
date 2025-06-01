"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    setIsLoggedIn(!!token)
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    router.push('/') // redirect to home
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      <Link href="/" className="text-xl font-bold text-blue-600">RidePool</Link>

      <div className="space-x-4 flex items-center">
        <Link href="/rides/nearby" className={pathname === "/rides/nearby" ? "font-semibold" : ""}>Nearby Rides</Link>

        {isClient && isLoggedIn && (
          <>
            <Link href="/dashboard" className={pathname === "/dashboard" ? "font-semibold" : ""}>Dashboard</Link>
            <Link href="/rides/create" className={pathname === "/rides/create" ? "font-semibold" : ""}>Post Ride</Link>

            <span className="ml-4 font-medium">Hello, {user?.name || 'User'}</span>

            <button
              onClick={handleLogout}
              className="ml-4 text-red-600 hover:text-red-800 cursor-pointer"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        )}

        {isClient && !isLoggedIn && (
          <>
            <Link href="/login" className={pathname === "/login" ? "font-semibold" : ""}>Login</Link>
            <Link href="/register" className={pathname === "/register" ? "font-semibold" : ""}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
