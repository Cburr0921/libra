const express = require('express');
const router = express.Router();
const borrowsCtrl = require('../controllers/borrows');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All routes start with '/api/borrows'

// GET /api/borrows - Get all active borrows
router.get('/', borrowsCtrl.borrowIndex);

// GET /api/borrows/user - Get user's borrow history
router.get('/user', ensureLoggedIn, borrowsCtrl.borrowUserHistory);

// GET /api/borrows/book/:bookId - Get book's borrow history
router.get('/book/:bookId', borrowsCtrl.borrowBookHistory);

// GET /api/borrows/:id - Get a specific borrow record
router.get('/:id', borrowsCtrl.borrowShow);

// POST /api/borrows - Create a new borrow record
router.post('/', ensureLoggedIn, borrowsCtrl.borrowCreate);

// PUT /api/borrows/:id - Update a borrow record
router.put('/:id', ensureLoggedIn, borrowsCtrl.borrowUpdate);

// PUT /api/borrows/:id/return - Return a borrowed book
router.put('/:id/return', ensureLoggedIn, borrowsCtrl.borrowReturn);

// DELETE /api/borrows/:id - Delete a borrow record
router.delete('/:id', ensureLoggedIn, borrowsCtrl.borrowDelete);

module.exports = router;
