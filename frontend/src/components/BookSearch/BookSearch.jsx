import { useState } from 'react';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setBooks(data.docs.slice(0, 10).map(book => ({
        key: book.key,
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
        publishYear: book.first_publish_year || 'Unknown',
        rating: 0,
        review: ''
      })));
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={searchBooks} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.key} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-3 aspect-h-4">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No cover available</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">By {book.author}</p>
              <p className="text-gray-500 text-sm mb-4">Published: {book.publishYear}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={book.rating}
                  onChange={(e) => {
                    const newBooks = books.map(b =>
                      b.key === book.key ? { ...b, rating: parseInt(e.target.value) } : b
                    );
                    setBooks(newBooks);
                  }}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="0">Select rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review
                </label>
                <textarea
                  value={book.review}
                  onChange={(e) => {
                    const newBooks = books.map(b =>
                      b.key === book.key ? { ...b, review: e.target.value } : b
                    );
                    setBooks(newBooks);
                  }}
                  className="w-full rounded-md border border-gray-300 p-2"
                  rows="3"
                  placeholder="Write your review..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;
