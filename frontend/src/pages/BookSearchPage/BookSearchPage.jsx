import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import * as bookService from '../../services/bookService';

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
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Search Books
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Search our extensive collection of books by title or author.
            </p>
            <div className="mt-10">
              <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-x-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleChange}
                  placeholder="Search by title or author..."
                  className="min-w-0 flex-auto rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder:text-gray-300 backdrop-blur-sm focus:ring-2 focus:ring-inset focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="flex-none rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          {error && (
            <div className="mb-8 text-center text-red-600 bg-white/80 rounded-lg p-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-white text-lg">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {books.map((book) => (
                <Link 
                  to={`/books${book.key}`} 
                  key={book.key}
                  className="group relative"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white/20 backdrop-blur-sm">
                    {book.cover_url ? (
                      <img 
                        src={book.cover_url} 
                        alt={`Cover of ${book.title}`}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-200/20 text-white">
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-medium text-white">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {book.author}
                    </p>
                    {book.first_publish_year && (
                      <p className="text-sm text-gray-200">
                        First published: {book.first_publish_year}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
