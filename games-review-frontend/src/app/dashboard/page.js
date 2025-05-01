'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gamesAPI } from '@/utils/api';
import { useAuth } from '@/utils/auth';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch user's games
  useEffect(() => {
    async function fetchUserGames() {
      try {
        setLoading(true);
        const data = await gamesAPI.getGames();
        
        // Filter to get only games added by this user
        const filteredGames = data.games.filter(game => 
          game.user && game.user.id === user?.id
        );
        
        setUserGames(filteredGames);
      } catch (err) {
        setError('Failed to load your games');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchUserGames();
    }
  }, [user]);

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="mb-6">Welcome back, {user.username}!</p>
      
      <div className="bg-white border rounded shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Games</h2>
          <Link
            href="/games/add"
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Add Game
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center p-4">Loading your games...</div>
        ) : error ? (
          <div className="bg-red-100 p-3 rounded text-red-700">
            {error}
          </div>
        ) : userGames.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {userGames.map(game => (
              <div key={game.id} className="border rounded p-4">
                <Link href={`/games/${game.id}`}>
                  <h3 className="font-bold text-lg hover:text-blue-600">
                    {game.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">
                  {game.reviewCount || 0} reviews
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {game.genre?.map((genre, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {genre}
                    </span>
                  ))}
                </div>
                <Link href={`/games/${game.id}`} className="text-blue-600 text-sm">
                  View details →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded text-center">
            <p className="mb-4">You have not added any games yet.</p>
            <Link 
              href="/games/add"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Your First Game
            </Link>
          </div>
        )}
      </div>
      
      <div className="bg-white border rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}