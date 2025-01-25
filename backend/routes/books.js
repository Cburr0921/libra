const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All routes start with '/api/books'

// GET /api/books/search
router.get('/search', booksCtrl.search);

// GET /api/books/:id
router.get('/:id', booksCtrl.show);

module.exports = router;
