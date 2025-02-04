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
        
        // If bookId is provided in query params, filter by book
        if (req.query.bookId) {
            // Ensure exact match with the OpenLibrary ID
            query.openLibraryId = {
                $eq: req.query.bookId  // Use exact match operator
            };
        }
        
        // If my=true and user is logged in, filter by user
        if (req.query.my === 'true' && req.user) {
            query.user = req.user._id;
        }
        
        // Find reviews with exact match
        const reviews = await Review.find(query)
            .populate('user')
            .sort('-createdAt')
            .limit(req.query.my ? undefined : 10);
        
        res.json(reviews);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch reviews' });
    }
}

async function reviewCreate(req, res) {
    try {
        // Check if user already has a review for this book
        const existingReview = await Review.findOne({
            user: req.user._id,
            openLibraryId: req.body.openLibraryId
        });

        if (existingReview) {
            return res.status(400).json({ 
                error: 'You have already reviewed this book. You can edit your existing review instead.' 
            });
        }

        // Add the user to the review
        req.body.user = req.user._id;
        const review = await Review.create(req.body);
        // Populate the user information before sending back
        const populatedReview = await review.populate('user');
        
        res.status(201).json(populatedReview);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create review' });
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
