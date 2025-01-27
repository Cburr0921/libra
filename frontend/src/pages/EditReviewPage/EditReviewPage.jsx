import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as reviewService from '../../services/reviewService';

export default function EditReviewPage({ user }) {
  const navigate = useNavigate();
  const { reviewId } = useParams();
  const [review, setReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: '',
    review: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadReview() {
      try {
        const reviewData = await reviewService.show(reviewId);
        if (reviewData.user._id !== user._id) {
          navigate('/');
          return;
        }
        setReview(reviewData);
        setFormData({
          rating: reviewData.rating,
          review: reviewData.review
        });
      } catch (err) {
        setError('Review not found');
      }
    }
    loadReview();
  }, [reviewId, user, navigate]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await reviewService.update(reviewId, formData);
      // Remove /works/ prefix from openLibraryId
      const bookId = review.openLibraryId.replace(/^\/works\//, '');
      navigate(`/books/works/${bookId}`);
    } catch (err) {
      setError('Failed to update review');
    }
  };

  if (!review) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Edit Review for {review.title}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Stars</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>

        <button type="submit">Update Review</button>
      </form>
    </div>
  );
}
