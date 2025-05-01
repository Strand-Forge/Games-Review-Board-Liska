const express = require('express');
const router = express.Router();
const { addReview, getGameReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Add a review to a game (protected route)
router.post('/', auth, addReview);

// Get reviews for a game with pagination
router.get('/game/:gameId', getGameReviews);

module.exports = router;