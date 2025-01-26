const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All routes start with '/api/reviews'

// GET /api/reviews - Get all reviews
router.get('/', reviewsCtrl.reviewIndex);

// GET /api/reviews/:bookId - Get all reviews for a specific book
router.get('/:bookId', reviewsCtrl.reviewIndex);

// GET /api/reviews/detail/:id - Get a single review
router.get('/detail/:id', reviewsCtrl.reviewShow);

// POST /api/reviews - Create a new review
router.post('/', ensureLoggedIn, reviewsCtrl.reviewCreate);

// PUT /api/reviews/:id - Update a review
router.put('/:id', ensureLoggedIn, reviewsCtrl.reviewUpdate);

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', ensureLoggedIn, reviewsCtrl.reviewDelete);

module.exports = router;
