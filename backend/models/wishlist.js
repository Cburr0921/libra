const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book_api_id: {
        type: String,
        required: true
    },
    book_title: {
        type: String,
        required: true
    },
    book_author: {
        type: String,
        required: true
    },
    added_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate wishlist entries for the same user and book
wishlistSchema.index({ user: 1, book_api_id: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
