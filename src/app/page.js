// app/page.js
import Link from "next/link";
import MotionDiv from "@/components/MotionDiv";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9fafb] px-6 flex items-center justify-center">
      <div className="max-w-4xl text-center space-y-10">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight"
        >
          RidePool
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
        >
          A seamless way to organize, post, and join rides with people you trust. Built for communities, colleges, and professionals.
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/dashboard">
            <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium shadow hover:bg-blue-700 transition">
              Explore Dashboard
            </div>
          </Link>
        </MotionDiv>
      </div>
    </main>
  );
}
