const Review = require('../models/review');

module.exports = {
    create,
    index,
    show,
    update,
    delete: deleteReview
};

async function create(req, res) {
    try {
        // Add the user to the review
        req.body.user = req.user._id;
        const review = await Review.create(req.body);
        // Populate the user information before sending back
        const populatedReview = await review.populate('user');
        res.status(201).json(populatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function index(req, res) {
    try {
        // Get all reviews for a specific book
        const reviews = await Review.find({ book_api_id: req.params.bookId })
            .populate('user')
            .sort('-createdAt');
        res.json(reviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function show(req, res) {
    try {
        const review = await Review.findById(req.params.id).populate('user');
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function update(req, res) {
    try {
        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        ).populate('user');
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteReview(req, res) {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
