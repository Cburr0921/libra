import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import * as bookService from '../../services/bookService';
import './BookSearchPage.css';

export default function BookSearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBooks() {
      const q = searchParams.get('q');
      if (!q) return;

      try {
        setLoading(true);
        setError('');
        const results = await bookService.search(q);
        setBooks(results);
      } catch (err) {
        setError('Failed to search books. Please try again.');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [searchParams]);

  async function handleSearch(evt) {
    evt.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function handleChange(evt) {
    setSearchQuery(evt.target.value);
  }

  return (
    <div className="BookSearchPage">
      <h1>Search Books</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search by title or author..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <Link 
              to={`/books${book.key}`} 
              key={book.key}
              className="book-card"
            >
              {book.cover_url && (
                <img 
                  src={book.cover_url} 
                  alt={`Cover of ${book.title}`}
                  className="book-cover"
                />
              )}
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                {book.first_publish_year && (
                  <p className="publish-year">First published: {book.first_publish_year}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
