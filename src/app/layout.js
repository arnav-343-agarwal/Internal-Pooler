import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'RidePool',
  description: 'Ride sharing coordination app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-50">
        <Sidebar />
        <main className="ml-64 p-4 w-full max-w-6xl">{children}</main>
      </body>
    </html>
  );
}
