import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken } from '../../services/authService';

export default function WishlistPage({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !getToken()) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlists', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data = await response.json();
      setWishlist(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading wishlist');
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const response = await fetch(`/api/wishlists/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      setWishlist(wishlist.filter(item => item._id !== itemId));
    } catch (err) {
      setError('Failed to remove book from wishlist');
    }
  };

  if (!user || !getToken()) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="bg-white">
        <div className="relative isolate">
          <div className="fixed inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Library interior with books"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-900/40 mix-blend-multiply" />
          </div>
          <div className="relative max-w-2xl mx-auto text-center pt-20">
            <h2 className="text-2xl font-semibold mb-2 text-white">Loading your wishlist...</h2>
            <p className="text-gray-200">Please wait while we fetch your books.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="relative isolate">
          <div className="fixed inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Library interior with books"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-900/40 mix-blend-multiply" />
          </div>
          <div className="relative max-w-2xl mx-auto text-center pt-20">
            <div className="text-red-400 bg-red-900/50 rounded-lg p-4">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Split wishlist into available and unavailable books
  const availableBooks = wishlist.filter(item => item.is_available);
  const unavailableBooks = wishlist.filter(item => !item.is_available);

  return (
    <div className="bg-white">
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
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              My Wishlist
            </h1>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center">
              <p className="text-xl text-white mb-4">Your wishlist is empty</p>
              <Link 
                to="/books" 
                className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-colors"
              >
                Browse books to add to your wishlist
              </Link>
            </div>
          ) : (
            <>
              {/* Available Books Section */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Available to Borrow</h2>
                {availableBooks.length === 0 ? (
                  <p className="text-center text-white text-lg">No books are currently available.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {availableBooks.map(item => (
                      <div key={item._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.book_title}</h3>
                        <p className="text-gray-700 mb-3">By {item.book_author}</p>
                        <div className="text-sm font-medium text-green-600 mb-4">
                          ✓ Available to Borrow
                        </div>
                        {item.notes && (
                          <p className="text-gray-800 mb-4">
                            <span className="font-semibold">Notes:</span> {item.notes}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/books/works/${item.book_api_id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleRemoveFromWishlist(item._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Unavailable Books Section */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Currently Borrowed</h2>
                {unavailableBooks.length === 0 ? (
                  <p className="text-center text-white text-lg">All your wishlisted books are available!</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {unavailableBooks.map(item => (
                      <div key={item._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.book_title}</h3>
                        <p className="text-gray-700 mb-3">By {item.book_author}</p>
                        <div className="text-sm font-medium text-red-600 mb-4">
                          ⚠ Currently Borrowed
                        </div>
                        {item.notes && (
                          <p className="text-gray-800 mb-4">
                            <span className="font-semibold">Notes:</span> {item.notes}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/books/works/${item.book_api_id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleRemoveFromWishlist(item._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
