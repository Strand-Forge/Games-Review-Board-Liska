import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    // If token in localstorage no need to make a fetch
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints for users
export const userAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  },
};

// API endpoints for games 
export const gamesAPI = {
  // Get all games with optional filters, sorting, and pagination
  getGames: async (params = {}) => {
    try {
      const response = await api.get('/games', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch games' };
    }
  },

  // Get a single game by ID
  getGameById: async (id) => {
    try {
      const response = await api.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch game details' };
    }
  },

  // Add a new game
  addGame: async (gameData) => {
    try {
      const response = await api.post('/games', gameData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add game' };
    }
  },
};

// API endpoints for reviews
export const reviewsAPI = {
  // Get reviews for a game with pagination
  getGameReviews: async (gameId, params = {}) => {
    try {
      const response = await api.get(`/reviews/game/${gameId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  },

  // Add a review to a game
  addReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add review' };
    }
  },
};

export default api;