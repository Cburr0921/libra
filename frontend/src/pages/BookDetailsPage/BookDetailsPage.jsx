import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createBorrow } from '../../services/borrowService';
import * as reviewService from '../../services/reviewService';

export default function BookDetailsPage({ user }) {
  const { id } = useParams();
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
        
        const bookId = id.replace(/^\/works\//, '');
        const apiUrl = `/api/books/${bookId}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Book not found' : 'Failed to fetch book details');
        }
        
        const data = await response.json();
        setBook(data);

        // Fetch reviews for this book
        const bookReviews = await reviewService.index(bookId);
        setReviews(bookReviews);
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

  if (loading) {
    return (
      <div>
        <h2>Loading book details...</h2>
        <p>Please wait while we fetch the book information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error Loading Book</h2>
        <p>{error}</p>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <h2>Book Not Found</h2>
        <p>We couldn't find the book you're looking for.</p>
      </div>
    );
  }

  return (
    <div>
      {!loading && !error && book && (
        <div>
          {book.coverUrl && (
            <img src={book.coverUrl} alt={book.title} />
          )}
          <div>
            <h1>{book.title}</h1>
            <h2>By {book.author}</h2>
            <p>Published: {book.publishDate}</p>
            <p>{book.description}</p>
            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h3>Subjects:</h3>
                <ul>
                  {book.subjects.slice(0, 5).map((subject, idx) => (
                    <li key={idx}>{subject}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              {user ? (
                <>
                  <Link to={`/books/works/${id}/review`}>
                    Write a Review
                  </Link>
                  <button 
                    onClick={handleBorrow}
                    disabled={borrowStatus.loading}
                  >
                    {borrowStatus.loading ? 'Borrowing...' : 'Borrow Book'}
                  </button>
                  {borrowStatus.error && (
                    <p>{borrowStatus.error}</p>
                  )}
                </>
              ) : (
                <Link to="/login">
                  Log in to Write Reviews and Borrow Books
                </Link>
              )}
            </div>

            <div>
              <h2>Reviews</h2>
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review!</p>
              ) : (
                <ul>
                  {reviews.map(review => (
                    <li key={review._id}>
                      <div>
                        <p>Rating: {review.rating} stars</p>
                        <p>{review.content}</p>
                        <p>By {review.user.name} on {new Date(review.createdAt).toLocaleDateString()}</p>
                        {user && user._id === review.user._id && (
                          <div>
                            <Link to={`/reviews/${review._id}/edit`}>
                              Edit Review
                            </Link>
                            <button onClick={() => handleDeleteReview(review._id)}>
                              Delete Review
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
