import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../services/authService';
import { show } from '../../services/bookService';
import { create, getBookReviews } from '../../services/reviewService';

export default function ReviewPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
  });
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for valid user and token
  useEffect(() => {
    if (!user || !getToken()) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        setLoading(true);
        const bookData = await show(id);
        setBook(bookData);

        // Check if user already has a review for this book
        const bookId = id.replace(/^\/works\//, '');
        const openLibraryId = `/works/${bookId}`;
        const reviews = await getBookReviews(openLibraryId);
        const userReview = reviews.find(review => review.user._id === user._id);
        
        if (userReview) {
          setError('You have already reviewed this book. You can edit your existing review instead.');
          // Navigate to the edit page for their existing review with the correct path
          navigate(`/reviews/${userReview._id}/edit`);
          return;
        }
      } catch (err) {
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchBookDetails();
  }, [id, user, navigate]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      if (!user || !getToken()) {
        throw new Error('Please log in to submit a review');
      }

      if (!book) {
        throw new Error('Book details not loaded');
      }

      // Remove any '/works/' prefix if present and then add it back in the correct format
      const bookId = id.replace(/^\/works\//, '');
      const openLibraryId = `/works/${bookId}`;

      // Check again for existing review right before submitting
      const reviews = await getBookReviews(openLibraryId);
      const userReview = reviews.find(review => review.user._id === user._id);
      
      if (userReview) {
        throw new Error('You have already reviewed this book. You can edit your existing review instead.');
      }

      await create({
        ...formData,
        openLibraryId,
        title: book.title,
        author: book.author,
      });

      // Navigate back to the book details page with the correct path
      navigate(`/books/works/${bookId}`);
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
      // If token is invalid, redirect to login
      if (err.message.includes('Unauthorized') || !getToken()) {
        navigate('/login');
      }
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  if (!user || !getToken()) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Library interior with books"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/40 mix-blend-multiply" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center pt-20">
          <h2 className="text-2xl font-semibold mb-2 text-white">Loading book details...</h2>
          <p className="text-gray-200">Please wait while we fetch the book information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Library interior with books"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/40 mix-blend-multiply" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center pt-20">
          <div className="text-red-400 bg-red-900/50 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Library interior with books"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/40 mix-blend-multiply" />
      </div>

      {/* Content */}
      {book && (
        <div className="relative max-w-2xl mx-auto p-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Review: {book.title}</h1>
            <h2 className="text-xl text-gray-800 mb-6">By {book.author}</h2>
            
            {error && (
              <div className="mb-6 text-red-400 bg-red-900/50 rounded-lg p-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-800">
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-white/80 border-gray-300 text-gray-900 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                >
                  <option value="5" className="text-gray-900">5 - Excellent</option>
                  <option value="4" className="text-gray-900">4 - Very Good</option>
                  <option value="3" className="text-gray-900">3 - Good</option>
                  <option value="2" className="text-gray-900">2 - Fair</option>
                  <option value="1" className="text-gray-900">1 - Poor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="review" className="block text-sm font-medium text-gray-800">
                  Review
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Write your review here..."
                  required
                  className="mt-1 block w-full rounded-md bg-white/80 border-gray-300 text-gray-900 shadow-sm focus:border-gray-900 focus:ring-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/books/works/${id}`)}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/10 border border-gray-300 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-transparent rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
