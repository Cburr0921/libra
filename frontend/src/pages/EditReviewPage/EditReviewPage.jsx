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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Review for {review.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-[120px,1fr] items-center gap-4">
          <label 
            htmlFor="rating" 
            className="text-sm font-medium text-gray-700"
          >
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black rounded-md"
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Stars</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-[120px,1fr] items-start gap-4">
          <label 
            htmlFor="review" 
            className="text-sm font-medium text-gray-700 pt-2"
          >
            Review
          </label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            required
            rows="5"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/books/works/${review.openLibraryId.replace(/^\/works\//, '')}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Update Review
          </button>
        </div>
      </form>
    </div>
  );
}
