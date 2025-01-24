const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// All routes start with '/api/books'

// GET /api/books/search
router.get('/search', booksCtrl.search);

// GET /api/books/:id
router.get('/:id', booksCtrl.show);

// POST /api/books/:id/reviews
router.post('/:id/reviews', ensureLoggedIn, booksCtrl.addReview);

// GET /api/books/:id/reviews
router.get('/:id/reviews', booksCtrl.getReviews);

// DELETE /api/books/:id/reviews/:reviewId
router.delete('/:id/reviews/:reviewId', ensureLoggedIn, booksCtrl.deleteReview);

module.exports = router;
