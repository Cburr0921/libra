const Wishlist = require('../models/wishlist');
const Borrow = require('../models/borrow');

async function index(req, res) {
    try {
        const wishlist = await Wishlist.find({ user: req.user._id })
            .sort('-created_at');
        
        // Check availability for each wishlisted book
        const wishlistWithAvailability = await Promise.all(
            wishlist.map(async (item) => {
                const isBorrowed = await Borrow.isBookBorrowed(item.book_api_id);
                return {
                    ...item.toObject(),
                    isAvailable: !isBorrowed
                };
            })
        );
        
        res.json(wishlistWithAvailability);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function create(req, res) {
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
            isAvailable: !isBorrowed
        });
    } catch (err) {
        // Handle duplicate entry error gracefully
        if (err.code === 11000) {
            res.status(400).json({ message: 'This book is already in your wishlist' });
            return;
        }
        res.status(400).json(err);
    }
}

async function deleteWishlistItem(req, res) {
    try {
        await Wishlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        res.json({ message: 'Book removed from wishlist' });
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    index,
    create,
    delete: deleteWishlistItem
};
