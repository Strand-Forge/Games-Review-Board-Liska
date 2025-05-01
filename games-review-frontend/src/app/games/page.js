'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { gamesAPI } from '@/utils/api';

// Simple star rating component
function StarRating({ rating }) {
  return (
    <div className="flex text-yellow-500">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}>
          {star <= Math.round(rating || 0) ? '★' : '☆'}
        </span>
      ))}
      <span className="ml-1 text-gray-600">({rating?.toFixed(1) || 'No ratings'})</span>
    </div>
  );
}

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        const response = await gamesAPI.getGames({ page, limit: 8 });
        setGames(response.games || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (err) {
        setError('Failed to load games');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, [page]);

  if (loading) {
    return <div className="text-center p-8">Loading games...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded text-red-800">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Games</h1>
        <Link href="/games/add" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Game
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded">No games found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.map(game => (
            <div key={game.id} className="border rounded shadow bg-white">
              <div className="p-4">
                <Link href={`/games/${game.id}`}>
                  <h2 className="font-bold text-lg hover:text-blue-600">{game.title}</h2>
                </Link>
                <p className="text-gray-600 text-sm mb-2">By {game.author}</p>
                <StarRating rating={game.averageRating} />
                <div className="mt-2 flex flex-wrap gap-1">
                  {game.genre?.map((genre, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t p-2 bg-gray-50 flex justify-end">
                <Link href={`/games/${game.id}`} className="text-blue-600 text-sm">
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="flex">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 mx-1 ${
                  page === i + 1 
                    ? 'bg-blue-600 text-white' 
                    : 'border'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}