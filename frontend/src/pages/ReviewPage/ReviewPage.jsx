import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../services/authService';
import { show } from '../../services/bookService';
import { create } from '../../services/reviewService';
import './ReviewPage.css';

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
      } catch (err) {
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchBookDetails();
  }, [id]);

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
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="ReviewPage">
      {book && (
        <>
          <h1>Review: {book.title}</h1>
          <h2>By {book.author}</h2>
          
          {error && <p className="error-message">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="review">Review</label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                rows="6"
                placeholder="Write your review here..."
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit">Submit Review</button>
              <button 
                type="button" 
                onClick={() => navigate(`/books/works/${id}`)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
