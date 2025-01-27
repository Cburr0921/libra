import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createBorrow } from '../../services/borrowService';
import * as reviewService from '../../services/reviewService';

export default function BookDetailsPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowStatus, setBorrowStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Remove any '/works/' prefix if present
        const bookId = id.replace(/^\/works\//, '');
        const apiUrl = `/api/books/${bookId}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Book not found' : 'Failed to fetch book details');
        }
        
        const data = await response.json();
        setBook(data);

        // Fetch reviews using the correct OpenLibrary ID format
        const openLibraryId = `/works/${bookId}`;
        
        // Validate that the OpenLibrary ID matches the expected format
        if (!/^\/works\/OL\d+W$/.test(openLibraryId)) {
          return;
        }
        
        const bookReviews = await reviewService.getBookReviews(openLibraryId);
        
        // Only set reviews if they match this book's ID
        const matchingReviews = bookReviews.filter(r => r.openLibraryId === openLibraryId);
        setReviews(matchingReviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleBorrow = async () => {
    try {
      setBorrowStatus({ loading: true, error: null });
      await createBorrow(id, book.title, book.author);
      setBorrowStatus({ loading: false, error: null });
      alert('Book borrowed successfully! It is due in 2 weeks.');
    } catch (err) {
      setBorrowStatus({ 
        loading: false, 
        error: err.message === 'Failed to borrow book' ? 
          'This book is currently borrowed by another user' : 
          err.message 
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
    } catch (err) {
      setError('Failed to delete review');
    }
  };

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
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-14 sm:pb-32 lg:px-8">
          {!loading && !error && book && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  {book.coverUrl && (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="w-48 h-auto rounded-lg shadow-md" 
                    />
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <h2 className="text-xl text-gray-600 mb-4">By {book.author}</h2>
                  <p className="text-sm text-gray-500 mb-4">Published: {book.publishDate}</p>
                  <p className="text-gray-700 mb-6">{book.description}</p>

                  {/* Subjects */}
                  {book.subjects && book.subjects.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Subjects:</h3>
                      <div className="flex flex-wrap gap-2">
                        {book.subjects.slice(0, 5).map((subject, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {user ? (
                      <>
                        <Link
                          to={`/reviews/works/${id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Write a Review
                        </Link>
                        <button
                          onClick={handleBorrow}
                          disabled={borrowStatus.loading}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                        >
                          {borrowStatus.loading ? 'Borrowing...' : 'Borrow Book'}
                        </button>
                        {borrowStatus.error && (
                          <p className="w-full text-red-600">{borrowStatus.error}</p>
                        )}
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Log in to Write Reviews and Borrow Books
                      </Link>
                    )}
                  </div>

                  {/* Reviews Section */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
                    {reviews.length === 0 ? (
                      <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map(review => {
                          const canEdit = user && user._id && review.user && review.user._id && 
                                        user._id.toString() === review.user._id.toString();
                          return (
                            <div key={review._id} className="bg-white rounded-lg shadow p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                                    <span className="text-gray-400">{'★'.repeat(5 - review.rating)}</span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    By {review.user.name} on {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                {canEdit && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => navigate(`/reviews/${review._id}/edit`)}
                                      className="text-sm text-red-600 hover:text-red-800"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReview(review._id)}
                                      className="text-sm text-red-600 hover:text-red-800"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-700">{review.review}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-2">Loading book details...</h2>
              <p>Please wait while we fetch the book information.</p>
            </div>
          )}

          {error && (
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-2">Error Loading Book</h2>
              <p>{error}</p>
              <p className="mt-2">Please try again later or contact support if the problem persists.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
