import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import libraryHero from '../../assets/images/library-hero.jpg';

export default function HomePage({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch active borrows if user is logged in
    if (user && user.token) {
      fetch('/api/borrows/user', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`))
      .then(data => {
        if (Array.isArray(data)) {
          const active = data.filter(borrow => !borrow.is_returned);
          setActiveBorrows(active);
        }
      })
      .catch(error => {
        console.error('Error fetching borrows:', error);
        setActiveBorrows([]);
      });
    }

    // Fetch all recent reviews
    fetch('/api/reviews')
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`))
      .then(data => {
        if (Array.isArray(data)) {
          setRecentReviews(data);
        }
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setRecentReviews([]);
      });
  }, [user]);

  const handleSearch = (evt) => {
    evt.preventDefault();
    navigate(`/books/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={libraryHero}
            alt="Library interior with warm lighting and rows of books"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-14 sm:pb-32 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Your Digital Library Companion
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Discover, borrow, and review books from our extensive collection. Join our community of readers today.
            </p>
            <div className="mt-10">
              <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-x-4">
                <input
                  type="search"
                  id="home-search"
                  name="search"
                  placeholder="Search for books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-0 flex-auto rounded-xl border-0 bg-white/10 px-4 py-3 text-base text-white placeholder:text-gray-300 backdrop-blur-sm focus:ring-2 focus:ring-inset focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="flex-none rounded-xl bg-white px-5 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Start Reading Today</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Browse our collection, manage your borrows, and share your thoughts with other readers.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Reviews Section */}
      {recentReviews.length > 0 && (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Recent Reviews</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                See what our community is reading and their thoughts.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {recentReviews.map(review => (
                <article key={review._id} className="flex flex-col items-start">
                  <div className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow p-8 w-full">
                    <div className="flex items-center gap-x-4 text-xs mb-4">
                      <time dateTime={review.createdAt} className="text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </time>
                      <div className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                    </div>
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <Link to={`/books/works/${review.openLibraryId.replace(/^\/works\//, '')}`}>
                          <span className="absolute inset-0" />
                          {review.title}
                        </Link>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{review.review}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Borrows Section */}
      {user && activeBorrows.length > 0 && (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Current Borrows</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Keep track of your borrowed books and due dates.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {activeBorrows.map(borrow => (
                <article key={borrow._id} className="flex flex-col items-start">
                  <div className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow p-8 w-full">
                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime={borrow.due_date} className="text-gray-500">
                        Due: {new Date(borrow.due_date).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <Link to={`/books/works/${borrow.book_api_id.split('/').pop()}`}>
                          <span className="absolute inset-0" />
                          {borrow.title}
                        </Link>
                      </h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mx-auto mt-32 max-w-7xl sm:mt-40 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-white px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start your reading journey today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Join our community of readers and discover your next favorite book.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? (
              <Link
                to="/books/search"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse Books
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Sign up <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}