import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/authService';
import { getMyReviews, deleteReview } from '../../services/reviewService';
import './MyReviewsPage.css';

export default function MyReviewsPage({ user }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                  onClick={() => handleDeleteReview(review._id)}
                  className="delete-btn"
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
