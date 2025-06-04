import MotionDiv from '@/components/MotionDiv'; // use relative path if needed
import Link from 'next/link';
import { Car, Users, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4">
      <MotionDiv
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-blue-700 mb-6 text-center"
      >
        Welcome to RidePool 🚗
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg text-gray-700 mb-8 text-center max-w-2xl"
      >
        Your all-in-one platform to post rides, find nearby routes, join trips, and manage requests.
      </MotionDiv>

      <Link href="/dashboard">
        <MotionDiv
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow hover:shadow-lg transition cursor-pointer"
        >
          Get Started
        </MotionDiv>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
        <FeatureCard icon={<Car />} title="Post a Ride" />
        <FeatureCard icon={<Users />} title="Join Rides" />
        <FeatureCard icon={<Rocket />} title="Manage Requests" />
      </div>
    </main>
  );
}

function FeatureCard({ icon, title }) {
  return (
    <MotionDiv
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 hover:bg-blue-50 transition"
    >
      <div className="text-blue-600">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </MotionDiv>
  );
}
