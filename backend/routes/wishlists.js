const express = require('express');
const router = express.Router();
const wishlistsCtrl = require('../controllers/wishlists');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// Get user's wishlist
router.get('/', ensureLoggedIn, wishlistsCtrl.index);

// Add book to wishlist
router.post('/', ensureLoggedIn, wishlistsCtrl.create);

// Remove book from wishlist
router.delete('/:id', ensureLoggedIn, wishlistsCtrl.delete);

module.exports = router;
