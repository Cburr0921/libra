import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import './BookSearchPage.css';

export default function BookSearchPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get('q');
    if (!query) {
      setLoading(false);
      return;
    }

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

  const handleSearch = (evt) => {
    evt.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="book-search">
      <h1>Search Books</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="search"
          id="book-search"
          name="book-search"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          required
        />
        <button type="submit" id="search-submit">Search</button>
      </form>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : books.length > 0 ? (
        <div className="book-grid">
          {books.map(book => (
            <div key={book.openLibraryId} className="book-card">
              {book.coverUrl && (
                <img src={book.coverUrl} alt={book.title} className="book-cover" />
              )}
              <div className="book-info">
                <h3>
                  <Link to={`/books${book.openLibraryId}`}>{book.title}</Link>
                </h3>
                <p>By {book.author}</p>
              </div>
            </div>
          ))}
        </div>
      ) : searchParams.get('q') ? (
        <p>No books found</p>
      ) : (
        <p>Enter a search term to find books</p>
      )}
    </div>
  );
}
