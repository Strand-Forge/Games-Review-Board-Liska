const express = require('express');
const router = express.Router();
const { getAllGames, getGameById, addGame } = require('../controllers/gameController');
const auth = require('../middleware/auth');

// Get all games (with pagination, filtering, sorting)
router.get('/', getAllGames);

// Get a single game by ID
router.get('/:id', getGameById);

// Add a new game (protected route)
router.post('/', auth, addGame);

module.exports = router;