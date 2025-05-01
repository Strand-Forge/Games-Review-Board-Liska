const { PrismaClient } = require('../../generated/prisma');
const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination');

const prisma = new PrismaClient();

/**
 * Get all games with pagination, filtering, and sorting
 * @route GET /api/games
 */
const getAllGames = async (req, res) => {
  try {
    // Get pagination parameters
    const { skip, take, page, limit } = getPaginationParams(req.query);
    
    // Conditions
    const where = {};
    
    // Add to conditions if exists
    if (req.query.genre) {
      where.genre = {
        has: req.query.genre
      };
    }
    
    if (req.query.author) {
      where.author = {
        contains: req.query.author,
        mode: 'insensitive'
      };
    }
    
    if (req.query.search) {
      where.title = {
        contains: req.query.search,
        mode: 'insensitive'
      };
    }
    
    // Order of results
    let orderBy = { createdAt: 'desc' }; // Default sort
    
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'rating':
          // Defined later, because it required array manipulations
          break;
        case 'date':
          orderBy = { createdAt: req.query.sortOrder === 'asc' ? 'asc' : 'desc' };
          break;
        case 'title':
          orderBy = { title: req.query.sortOrder === 'asc' ? 'asc' : 'desc' };
          break;
        default:
          break;
      }
    }
    
    // Get total count for pagination
    const totalGames = await prisma.game.count({ where });
    
    // Fetch games with filters, sorting, and pagination
    let games = await prisma.game.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    });
    
    // Calculate average rating for each game
    games = games.map(game => {
      const ratings = game.reviews.map(review => review.rating);
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : null;
      
      return {
        ...game,
        reviewCount: game.reviews.length,
        averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null
      };
    });
    

    if (req.query.sortBy === 'rating') {
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      games.sort((a, b) => {
        if (a.averageRating === null && b.averageRating === null) return 0;
        if (a.averageRating === null) return 1 * sortOrder;
        if (b.averageRating === null) return -1 * sortOrder;
        
        return sortOrder * (a.averageRating - b.averageRating);
      });
    }
    
    // Generate pagination metadata
    const pagination = getPaginationMetadata(totalGames, page, limit);
    
    res.json({
      games,
      pagination
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a single game by ID
 * @route GET /api/games/:id?reviewToShow=5
 */
const getGameById = async (req, res) => {
  const { id } = req.params;
  const reviewToShow = parseInt(req.query.reviewToShow) || 5;
  
  try {
    const game = await prisma.game.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          },
          take: reviewToShow,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Calculate average rating
    const ratings = game.reviews.map(review => review.rating);
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : null;
    
    // Get total review count for pagination
    const reviewCount = await prisma.review.count({
      where: { gameId: parseInt(id) }
    });
    
    const enhancedGame = {
      ...game,
      reviewCount,
      averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null
    };
    
    res.json(enhancedGame);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Add a new game
 * @route POST /api/games
 */
const addGame = async (req, res) => {
  const { title, description, author, genre } = req.body;
  
  try {
    const game = await prisma.game.create({
      data: {
        title,
        description,
        author,
        genre,
        userId: req.user.id
      }
    });
    
    res.status(201).json({
      message: 'Game added successfully',
      game
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  addGame
};