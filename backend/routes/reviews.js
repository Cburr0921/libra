const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All routes start with '/api/reviews'

// GET /api/reviews/:bookId - Get all reviews for a specific book
router.get('/:bookId', reviewsCtrl.index);

// GET /api/reviews/detail/:id - Get a single review
router.get('/detail/:id', reviewsCtrl.show);

// POST /api/reviews - Create a new review
router.post('/', ensureLoggedIn, reviewsCtrl.create);

// PUT /api/reviews/:id - Update a review
router.put('/:id', ensureLoggedIn, reviewsCtrl.update);

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', ensureLoggedIn, reviewsCtrl.delete);

module.exports = router;
