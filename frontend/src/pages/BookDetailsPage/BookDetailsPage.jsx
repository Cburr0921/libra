import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetailsPage.css';

export default function BookDetailsPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add /works/ prefix if not present
        const fullId = id.startsWith('/works/') ? id : `/works/${id}`;
        const apiUrl = `/api/books${fullId}`;
        
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

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

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
    <div className="book-details">
      <h1>{book.title}</h1>
      <h2>by {book.author}</h2>
      {book.coverUrl && (
        <img src={book.coverUrl} alt={`Cover of ${book.title}`} className="book-cover" />
      )}
      <div className="book-info">
        <p><strong>Published:</strong> {book.publishDate}</p>
        {book.description && (
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
        )}
        {book.subjects && book.subjects.length > 0 && (
          <div className="book-subjects">
            <h3>Subjects</h3>
            <ul>
              {book.subjects.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
