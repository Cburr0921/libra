const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');

// All routes start with '/api/books'

// GET /api/books/search
router.get('/search', booksCtrl.search);

// Log all requests
router.use((req, res, next) => {
  console.log('Books API request:', {
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    baseUrl: req.baseUrl
  });
  next();
});

// GET /api/books/works/OL...W or /api/books/OL...W
router.get('/works/:id(OL\\d+W)', booksCtrl.show);
router.get('/:id(OL\\d+W)', booksCtrl.show);

module.exports = router;
