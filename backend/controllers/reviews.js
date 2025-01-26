const Review = require('../models/review');

module.exports = {
    reviewCreate,
    reviewIndex,
    reviewShow,
    reviewUpdate,
    reviewDelete
};

async function reviewIndex(req, res) {
    try {
        let query = {};
        
        // If bookId is provided, filter by book
        if (req.params.bookId) {
            query.book_api_id = req.params.bookId;
        }
        
        // If my=true and user is logged in, filter by user
        if (req.query.my === 'true' && req.user) {
            query.user = req.user._id;
        }
        
        const reviews = await Review.find(query)
            .populate('user')
            .sort('-createdAt')
            .limit(req.query.my ? undefined : 10); // Only limit if not user's reviews
        res.json(reviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function reviewCreate(req, res) {
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

async function reviewShow(req, res) {
    try {
        const review = await Review.findById(req.params.id).populate('user');
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function reviewUpdate(req, res) {
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

async function reviewDelete(req, res) {
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
