'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-blue-600 text-white p-8 rounded my-6">
        <h1 className="text-3xl font-bold mb-4">Games Review Board</h1>
        <p className="text-xl mb-4">Discover, review, and share your favorite games</p>
        <div className="flex gap-4">
          <Link href="/games" className="bg-white text-blue-600 px-4 py-2 rounded">
            Browse Games
          </Link>
          <Link href="/register" className="bg-blue-700 text-white px-4 py-2 rounded">
            Join Now
          </Link>
        </div>
      </div>
      
      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 my-6">
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-bold mb-2">Browse Games</h2>
          <p>Discover new games across different genres</p>
        </div>
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-bold mb-2">Rate & Review</h2>
          <p>Share your opinions with the community</p>
        </div>
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-bold mb-2">Add Games</h2>
          <p>Contribute to our growing database</p>
        </div>
      </div>
    </div>
  );
}