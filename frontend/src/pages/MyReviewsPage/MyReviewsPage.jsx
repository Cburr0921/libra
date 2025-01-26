import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/authService';
import { getMyReviews, deleteReview, update } from '../../services/reviewService';
import './MyReviewsPage.css';

export default function MyReviewsPage({ user }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    if (!user || !getToken()) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const userReviews = await getMyReviews();
        setReviews(userReviews);
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchReviews();
    }
  }, [user]);

  async function handleDeleteReview(reviewId) {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (err) {
        setError('Failed to delete review. Please try again.');
      }
    }
  }

  function handleEditClick(review) {
    setEditingReview({
      ...review,
      rating: review.rating.toString()
    });
  }

  function handleCancelEdit() {
    setEditingReview(null);
  }

  async function handleUpdateReview(e) {
    e.preventDefault();
    try {
      const updatedReview = await update(editingReview._id, {
        rating: parseInt(editingReview.rating),
        review: editingReview.review
      });
      setReviews(reviews.map(r => r._id === updatedReview._id ? updatedReview : r));
      setEditingReview(null);
    } catch (err) {
      setError('Failed to update review. Please try again.');
    }
  }

  if (!user || !getToken()) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="MyReviewsPage">
      <h1>My Reviews</h1>
      
      {error && <p className="error-message">{error}</p>}
      
      {reviews.length === 0 ? (
        <p>You haven't written any reviews yet.</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review._id} className="review-card">
              {editingReview && editingReview._id === review._id ? (
                <form onSubmit={handleUpdateReview} className="edit-review-form">
                  <h3>{review.title}</h3>
                  <h4>by {review.author}</h4>
                  <div className="form-group">
                    <label>Rating:</label>
                    <select 
                      value={editingReview.rating}
                      onChange={e => setEditingReview({...editingReview, rating: e.target.value})}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Review:</label>
                    <textarea
                      value={editingReview.review}
                      onChange={e => setEditingReview({...editingReview, review: e.target.value})}
                      rows="4"
                    />
                  </div>
                  <div className="edit-actions">
                    <button type="submit" className="save-btn">Save</button>
                    <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{review.title}</h3>
                  <h4>by {review.author}</h4>
                  <div className="rating">Rating: {review.rating} / 5</div>
                  <p className="review-content">{review.review}</p>
                  <div className="review-actions">
                    <button 
                      onClick={() => navigate(`/books/works/${review.openLibraryId.replace(/^\/works\//, '')}`)}
                      className="view-book-btn"
                    >
                      View Book
                    </button>
                    <button 
                      onClick={() => handleEditClick(review)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteReview(review._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
