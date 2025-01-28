import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBorrows, returnBook } from '../../services/borrowService';
import { getToken } from '../../services/authService';

export default function MyBorrowsPage({ user }) {
  const navigate = useNavigate();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !getToken()) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchBorrows() {
      try {
        setLoading(true);
        const userBorrows = await getUserBorrows();
        setBorrows(userBorrows);
      } catch (err) {
        setError('Failed to load borrowed books. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchBorrows();
    }
  }, [user]);

  const handleReturn = async (borrowId) => {
    try {
      const returnedBorrow = await returnBook(borrowId);
      // Update the borrows list with the returned data
      const updatedBorrows = borrows.map(borrow => 
        borrow._id === borrowId ? returnedBorrow : borrow
      );
      setBorrows(updatedBorrows);
    } catch (err) {
      setError('Failed to return book. Please try again.');
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
            <h2 className="text-2xl font-semibold mb-2 text-white">Loading your borrowed books...</h2>
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

  const activeBorrows = borrows.filter(borrow => !borrow.is_returned);
  const returnedBorrows = borrows.filter(borrow => borrow.is_returned);

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
              My Borrowed Books
            </h1>
          </div>

          {/* Currently Borrowed Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Currently Borrowed</h2>
            {activeBorrows.length === 0 ? (
              <p className="text-center text-white text-lg">You don't have any books borrowed at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeBorrows.map(borrow => (
                  <div key={borrow._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{borrow.book_title}</h3>
                    <p className="text-gray-700 mb-3">By {borrow.book_author}</p>
                    <div className="space-y-2 text-gray-800 mb-6">
                      <p>Borrowed on: {new Date(borrow.borrow_date).toLocaleDateString()}</p>
                      <p>Due on: {new Date(borrow.due_date).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleReturn(borrow._id)}
                      className="w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                    >
                      Return Book
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Previously Borrowed Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Previously Borrowed</h2>
            {returnedBorrows.length === 0 ? (
              <p className="text-center text-white text-lg">You haven't returned any books yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {returnedBorrows.map(borrow => (
                  <div key={borrow._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{borrow.book_title}</h3>
                    <p className="text-gray-700 mb-3">By {borrow.book_author}</p>
                    <div className="space-y-2 text-gray-800">
                      <p>Borrowed on: {new Date(borrow.borrow_date).toLocaleDateString()}</p>
                      <p>Returned on: {new Date(borrow.return_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
