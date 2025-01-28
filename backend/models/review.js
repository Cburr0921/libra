const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    openLibraryId: { 
      type: String, 
      required: true,
      match: /^\/works\/OL[0-9]+W$/
    },
    title: { 
      type: String, 
      required: true 
    },
    author: { 
      type: String, 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    review: { 
      type: String, 
      required: true 
    },
    coverUrl: { 
      type: String 
    },
    publishYear: { 
      type: String 
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index to prevent multiple reviews from same user on same book
reviewSchema.index({ user: 1, openLibraryId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
