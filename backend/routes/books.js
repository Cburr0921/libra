const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');

// All routes start with '/api/books'

// GET /api/books/search
router.get('/search', booksCtrl.search);

// GET /api/books/works/OL...W or /api/books/OL...W
router.get('/works/:id(OL\\d+W)', booksCtrl.show);
router.get('/:id(OL\\d+W)', booksCtrl.show);

module.exports = router;
