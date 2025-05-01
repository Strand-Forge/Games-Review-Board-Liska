'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gamesAPI } from '@/utils/api';
import { useAuth } from '@/utils/auth';

// Predefined genres
const GENRES = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Shooter',
  'Puzzle', 'Simulation', 'Sports', 'Racing', 'Horror',
  'Platformer', 'Open World', 'Indie'
];

export default function AddGamePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleGenreToggle = (genre) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter(g => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !author || !description || genres.length === 0) {
      setError('Please fill in all fields and select at least one genre');
      return;
    }
    
    try {
      setLoading(true);
      const gameData = {
        title,
        author,
        description,
        genre: genres
      };
      
      const result = await gamesAPI.addGame(gameData);
      router.push(`/games/${result.game.id}`);
    } catch (err) {
      setError('Failed to add game');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/games" className="text-blue-600">
          ← Back to Games
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Add New Game</h1>
      
      <div className="bg-white border rounded shadow p-6">
        {error && (
          <div className="bg-red-100 p-3 rounded text-red-700 mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Game Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter game title"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Game Author/Studio</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter game author or studio"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Genres</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {GENRES.map(genre => (
                <div key={genre} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`genre-${genre}`}
                    checked={genres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="mr-2"
                  />
                  <label htmlFor={`genre-${genre}`}>{genre}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full"
              rows={6}
              placeholder="Enter game description"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link 
              href="/games" 
              className="px-4 py-2 border rounded"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? 'Adding Game...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}