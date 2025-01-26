import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BookDetailsPage.css';

export default function BookDetailsPage({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Extract just the ID part if it includes /works/
        const bookId = id.replace(/^\/works\//, '');
        const apiUrl = `/api/books/${bookId}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Book not found' : 'Failed to fetch book details');
        }
        
        const data = await response.json();
        setBook(data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, user]);

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading book details...</h2>
        <p>Please wait while we fetch the book information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Book</h2>
        <p>{error}</p>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="error">
        <h2>Book Not Found</h2>
        <p>We couldn't find the book you're looking for.</p>
      </div>
    );
  }

  return (
    <div>
      {!loading && !error && book && (
        <div className="book-details">
          {book.coverUrl && (
            <img src={book.coverUrl} alt={book.title} className="book-cover" />
          )}
          <div className="book-info">
            <h1>{book.title}</h1>
            <h2>By {book.author}</h2>
            <p className="publish-date">Published: {book.publishDate}</p>
            <p className="description">{book.description}</p>
            {book.subjects && book.subjects.length > 0 && (
              <div className="subjects">
                <h3>Subjects:</h3>
                <ul>
                  {book.subjects.slice(0, 5).map((subject, idx) => (
                    <li key={idx}>{subject}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="actions">
              {user ? (
                <Link 
                  to={`/books/works/${id}/review`}
                  className="write-review-button"
                >
                  Write a Review
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="write-review-button"
                >
                  Log in to Write a Review
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
