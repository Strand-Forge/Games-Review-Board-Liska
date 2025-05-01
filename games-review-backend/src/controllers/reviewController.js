const { PrismaClient } = require('../../generated/prisma');
const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination');

const prisma = new PrismaClient();

/**
 * Add a review to a game
 * @route POST /api/reviews
 */
const addReview = async (req, res) => {
  const { gameId, rating, comment } = req.body;
  
  try {
    // Check if the game exists
    const game = await prisma.game.findUnique({
      where: { id: parseInt(gameId) }
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if user has already reviewed this game
    const existingReview = await prisma.review.findFirst({
      where: {
        gameId: parseInt(gameId),
        userId: req.user.id
      }
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this game' });
    }
    
    // Validate rating
    const numRating = parseInt(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: numRating,
        comment,
        gameId: parseInt(gameId),
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get reviews for a game with pagination
 * @route GET /api/reviews/game/:gameId
 */
const getGameReviews = async (req, res) => {
  const { gameId } = req.params;
  
  try {
    // Get pagination parameters
    const { skip, take, page, limit } = getPaginationParams(req.query);
    
    // Check if the game exists
    const game = await prisma.game.findUnique({
      where: { id: parseInt(gameId) }
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Order of results
    let orderBy = { createdAt: 'desc' }; // Default
    
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'rating':
          orderBy = { rating: req.query.sortOrder === 'asc' ? 'asc' : 'desc' };
          break;
        case 'date':
          orderBy = { createdAt: req.query.sortOrder === 'asc' ? 'asc' : 'desc' };
          break;
        default:
          break;
      }
    }
    
    // Get total count for pagination
    const totalReviews = await prisma.review.count({
      where: { gameId: parseInt(gameId) }
    });
    
    // Fetch reviews with pagination and sorting
    const reviews = await prisma.review.findMany({
      where: { gameId: parseInt(gameId) },
      orderBy,
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    // Generate pagination metadata
    const pagination = getPaginationMetadata(totalReviews, page, limit);
    
    res.json({
      reviews,
      pagination
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addReview,
  getGameReviews
};