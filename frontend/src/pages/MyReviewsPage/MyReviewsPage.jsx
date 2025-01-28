import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken } from '../../services/authService';
import { getMyReviews, deleteReview } from '../../services/reviewService';

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
          <h2 className="text-2xl font-semibold mb-2 text-white">Loading your reviews...</h2>
          <p className="text-gray-200">Please wait while we fetch your reviews.</p>
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
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate">
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
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-14 sm:pb-32 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              My Reviews
            </h1>
          </div>
          
          {error && (
            <div className="mx-auto max-w-2xl mb-8">
              <div className="text-red-400 bg-red-900/50 rounded-lg p-4 text-center">
                {error}
              </div>
            </div>
          )}
          
          {reviews.length === 0 ? (
            <div className="text-center text-white text-lg">
              You haven't written any reviews yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map(review => (
                <div key={review._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{review.title}</h3>
                  <h4 className="text-gray-700 mb-3">by {review.author}</h4>
                  <div className="text-gray-900 mb-3">Rating: {review.rating} / 5</div>
                  <p className="text-gray-800 mb-6">{review.review}</p>
                  <div className="flex flex-wrap gap-3 mt-auto">
                    <button 
                      onClick={() => navigate(`/books/works/${review.openLibraryId.replace(/^\/works\//, '')}`)}
                      className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                    >
                      View Book
                    </button>
                    <button 
                      onClick={() => navigate(`/reviews/${review._id}/edit`)}
                      className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                    >
                      Edit Review
                    </button>
                    <button 
                      onClick={() => handleDeleteReview(review._id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
