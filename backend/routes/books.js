const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');

// Disable caching for development
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// All routes start with '/api/books'

// GET /api/books/search
router.get('/search', booksCtrl.search);

// GET /api/books/:id
router.get('/:id', (req, res) => {
  const bookId = req.params.id;
  req.bookId = bookId; // Pass the ID to the controller
  booksCtrl.show(req, res);
});

module.exports = router;
