import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './BookSearchPage.css';

export default function BookSearchPage() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const query = searchParams.get('q');
    if (!query) return;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch books');
        const data = await response.json();
        setBooks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="book-search">
      <h1>Search Results</h1>
      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        <div className="book-grid">
          {books.map(book => (
            <div key={book.openLibraryId} className="book-card">
              {book.coverUrl && (
                <img src={book.coverUrl} alt={book.title} className="book-cover" />
              )}
              <h2>{book.title}</h2>
              <p>{book.author}</p>
              <p>Published: {book.publishYear}</p>
              <Link 
                to={`/books/works/${book.openLibraryId}`} 
                className="view-button"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
