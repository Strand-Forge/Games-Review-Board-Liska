'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { gamesAPI, reviewsAPI } from '@/utils/api';
import { useAuth } from '@/utils/auth';

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

// Review form component
function ReviewForm({ gameId, onReviewAdded }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 p-4 rounded text-center mb-4">
        <p>Please <Link href="/login" className="text-blue-600">login</Link> to leave a review.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      setError('Please write a comment');
      return;
    }

    try {
      setLoading(true);
      const result = await reviewsAPI.addReview({
        gameId: parseInt(gameId),
        rating,
        comment
      });
      
      setComment('');
      setRating(5);
      onReviewAdded(result.review);
    } catch (err) {
      setError('Failed to add review');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded p-4 mb-4">
      <h3 className="font-bold mb-3">Write a Review</h3>
      
      {error && (
        <div className="bg-red-100 p-2 rounded text-red-700 mb-3">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Rating</label>
          <select 
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very Good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Fair</option>
            <option value={1}>1 - Poor</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label className="block mb-1">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 rounded w-full"
            rows={3}
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default function GameDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true);
        const data = await gamesAPI.getGameById(id);
        setGame(data);
      } catch (err) {
        setError('Failed to load game details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setGame(prevGame => {
      if (!prevGame) return null;
      
      const updatedReviews = [newReview, ...(prevGame.reviews || [])];
      const ratings = updatedReviews.map(r => r.rating);
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;
      
      return {
        ...prevGame,
        reviews: updatedReviews,
        reviewCount: updatedReviews.length,
        averageRating: avgRating
      };
    });
  };

  if (loading) {
    return <div className="text-center p-8">Loading game details...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded text-red-800">{error}</div>;
  }

  if (!game) {
    return <div className="text-center p-8">Game not found</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/games" className="text-blue-600">
          ← Back to Games
        </Link>
      </div>
      
      <div className="bg-white border rounded shadow p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <span className="text-gray-600">By:</span> {game.author}
          </div>
          <div>
            <StarRating rating={game.averageRating} />
          </div>
          <div>
            <span className="text-gray-600">Reviews:</span> {game.reviewCount || 0}
          </div>
        </div>
        
        <div className="mb-4">
          <h2 className="font-bold mb-2">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {game.genre?.map((genre, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h2 className="font-bold mb-2">Description</h2>
          <p className="whitespace-pre-line">{game.description}</p>
        </div>
        
        <div className="text-sm text-gray-600">
          Added by: {game.user?.username || 'Unknown'}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        
        <ReviewForm gameId={id} onReviewAdded={handleReviewAdded} />
        
        {(game.reviews?.length || 0) > 0 ? (
          <div className="space-y-4">
            {game.reviews.map(review => (
              <div key={review.id} className="bg-white border rounded p-4">
                <div className="flex justify-between mb-2">
                  <div className="font-bold">{review.user?.username || 'Unknown'}</div>
                  <StarRating rating={review.rating} />
                </div>
                <p>{review.comment}</p>
                <div className="text-sm text-gray-600 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded text-center">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>
    </div>
  );
}