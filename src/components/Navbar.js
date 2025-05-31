"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token")

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      <Link href="/" className="text-xl font-bold text-blue-600">RidePool</Link>
      <div className="space-x-4">
        <Link href="/rides/nearby" className={pathname === "/rides/nearby" ? "font-semibold" : ""}>Nearby Rides</Link>
        {isLoggedIn && <Link href="/dashboard">Dashboard</Link>}
        {isLoggedIn && <Link href="/rides/create">Post Ride</Link>}
        {!isLoggedIn && <Link href="/login">Login</Link>}
        {!isLoggedIn && <Link href="/register">Register</Link>}
      </div>
    </nav>
  )
}
