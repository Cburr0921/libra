const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowSchema = new Schema({
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
    borrow_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    due_date: {
        type: Date,
        required: true
    },
    return_date: {
        type: Date,
        default: null
    },
    is_returned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

borrowSchema.index({ user: 1, book_api_id: 1 });

borrowSchema.virtual('is_overdue').get(function() {
    if (this.is_returned) return false;
    return new Date() > this.due_date;
});

// Static method to check if a book is currently borrowed
borrowSchema.statics.isBookBorrowed = async function(bookApiId) {
    const activeBorrow = await this.findOne({
        book_api_id: bookApiId,
        is_returned: false
    });
    return activeBorrow !== null;
};

module.exports = mongoose.model('Borrow', borrowSchema);
