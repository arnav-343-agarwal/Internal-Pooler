"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState,useEffect } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      <Link href="/" className="text-xl font-bold text-blue-600">RidePool</Link>
      <div className="space-x-4">
        <Link href="/rides/nearby" className={pathname === "/rides/nearby" ? "font-semibold" : ""}>Nearby Rides</Link>
        {isClient && isLoggedIn && <Link href="/dashboard">Dashboard</Link>}
        {isClient && isLoggedIn && <Link href="/rides/create">Post Ride</Link>}
        {isClient && !isLoggedIn && <Link href="/login">Login</Link>}
        {isClient && !isLoggedIn && <Link href="/register">Register</Link>}
      </div>
    </nav>
  )
}
