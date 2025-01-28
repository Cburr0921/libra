const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const Borrow = require('../models/borrow');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// Get user's wishlist
router.get('/', ensureLoggedIn, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user._id })
            .sort('-createdAt');
        
        // Check availability for each wishlisted book
        const wishlistWithAvailability = await Promise.all(
            wishlist.map(async (item) => {
                const isBorrowed = await Borrow.isBookBorrowed(item.book_api_id);
                return {
                    ...item.toObject(),
                    is_available: !isBorrowed
                };
            })
        );
        
        res.json(wishlistWithAvailability);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Add book to wishlist
router.post('/', ensureLoggedIn, async (req, res) => {
    try {
        // Check if the book is currently borrowed
        const isBorrowed = await Borrow.isBookBorrowed(req.body.book_api_id);
        
        const wishlistItem = await Wishlist.create({
            user: req.user._id,
            book_api_id: req.body.book_api_id,
            book_title: req.body.book_title,
            book_author: req.body.book_author,
            notes: req.body.notes
        });

        res.json({
            ...wishlistItem.toObject(),
            is_available: !isBorrowed
        });
    } catch (err) {
        // Handle duplicate entry error gracefully
        if (err.code === 11000) {
            res.status(400).json({ message: 'This book is already in your wishlist' });
        } else {
            res.status(400).json(err);
        }
    }
});

// Remove book from wishlist
router.delete('/:id', ensureLoggedIn, async (req, res) => {
    try {
        const wishlistItem = await Wishlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!wishlistItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }
        res.json({ message: 'Book removed from wishlist' });
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
