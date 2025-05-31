import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'RidePool',
  description: 'Ride sharing coordination app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-4 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  )
}
