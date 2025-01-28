const Borrow = require('../models/borrow');
const Wishlist = require('../models/wishlist');

async function isBookAvailable(bookApiId) {
    const activeBorrow = await Borrow.findOne({
        book_api_id: bookApiId,
        is_returned: false
    });
    return !activeBorrow;
}

module.exports = {
    borrowCreate,
    borrowIndex,
    borrowShow,
    borrowUpdate,
    borrowDelete,
    borrowReturn,
    borrowUserHistory,
    borrowBookHistory
};

async function borrowCreate(req, res) {
    try {
        // Check if book is already borrowed
        const isAvailable = await isBookAvailable(req.body.book_api_id);
        if (!isAvailable) {
            return res.status(400).json({ error: 'This book is currently borrowed by another user' });
        }

        // Add the user to the borrow record
        req.body.user = req.user._id;
        
        // Set due date if not provided (default to 2 weeks)
        if (!req.body.due_date) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
            req.body.due_date = dueDate;
        }

        const borrow = await Borrow.create(req.body);
        const populatedBorrow = await borrow.populate('user');
        res.status(201).json(populatedBorrow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function borrowIndex(req, res) {
    try {
        // Get all active borrows (not returned)
        const borrows = await Borrow.find({ is_returned: false })
            .populate('user')
            .sort('-createdAt');
        res.json(borrows);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function borrowShow(req, res) {
    try {
        const borrow = await Borrow.findById(req.params.id).populate('user');
        if (!borrow) return res.status(404).json({ error: 'Borrow record not found' });
        res.json(borrow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function borrowUpdate(req, res) {
    try {
        const borrow = await Borrow.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        ).populate('user');
        if (!borrow) return res.status(404).json({ error: 'Borrow record not found' });
        res.json(borrow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function borrowDelete(req, res) {
    try {
        const borrow = await Borrow.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!borrow) return res.status(404).json({ error: 'Borrow record not found' });
        res.json({ message: 'Borrow record deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function borrowReturn(req, res) {
    try {
        const borrow = await Borrow.findOne({
            _id: req.params.id,
            user: req.user._id,
            is_returned: false
        });

        if (!borrow) return res.status(404).json({ error: 'Active borrow record not found' });

        borrow.is_returned = true;
        borrow.return_date = new Date();
        await borrow.save({ validateBeforeSave: false });

        // Find users who have this book in their wishlist
        const wishlistUsers = await Wishlist.find({
            book_api_id: borrow.book_api_id
        }).populate('user');

        // In a real application, you would send email notifications here
        const notifications = wishlistUsers.map(wishlistItem => ({
            userId: wishlistItem.user._id,
            userEmail: wishlistItem.user.email,
            message: `The book "${borrow.book_title}" is now available!`
        }));

        const populatedBorrow = await borrow.populate('user');
        res.json({ borrow: populatedBorrow, notifications });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function borrowUserHistory(req, res) {
    try {
        const borrows = await Borrow.find({ user: req.user._id })
            .populate('user')
            .sort('-createdAt');
        res.json(borrows);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function borrowBookHistory(req, res) {
    try {
        const borrows = await Borrow.find({ book_api_id: req.params.bookId })
            .populate('user')
            .sort('-createdAt');
        res.json(borrows);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
