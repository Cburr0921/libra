import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBorrows, returnBook } from '../../services/borrowService';
import { getToken } from '../../services/authService';
import './MyBorrowsPage.css';

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
      await returnBook(borrowId);
      // Update the borrows list after returning
      const updatedBorrows = borrows.map(borrow => 
        borrow._id === borrowId 
          ? { ...borrow, is_returned: true, return_date: new Date() }
          : borrow
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
    return <div className="loading">Loading your borrowed books...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const activeBorrows = borrows.filter(borrow => !borrow.is_returned);
  const returnedBorrows = borrows.filter(borrow => borrow.is_returned);

  return (
    <div className="MyBorrowsPage">
      <h1>My Borrowed Books</h1>
      
      <section className="active-borrows">
        <h2>Currently Borrowed</h2>
        {activeBorrows.length === 0 ? (
          <p>You don't have any books borrowed at the moment.</p>
        ) : (
          <ul className="borrows-list">
            {activeBorrows.map(borrow => (
              <li key={borrow._id} className="borrow-item">
                <div className="book-info">
                  <h3>{borrow.book_title}</h3>
                  <p>By {borrow.book_author}</p>
                  <p>Borrowed on: {new Date(borrow.borrow_date).toLocaleDateString()}</p>
                  <p>Due on: {new Date(borrow.due_date).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => handleReturn(borrow._id)}
                  className="return-button"
                >
                  Return Book
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="returned-borrows">
        <h2>Previously Borrowed</h2>
        {returnedBorrows.length === 0 ? (
          <p>You haven't returned any books yet.</p>
        ) : (
          <ul className="borrows-list">
            {returnedBorrows.map(borrow => (
              <li key={borrow._id} className="borrow-item returned">
                <div className="book-info">
                  <h3>{borrow.book_title}</h3>
                  <p>By {borrow.book_author}</p>
                  <p>Borrowed: {new Date(borrow.borrow_date).toLocaleDateString()}</p>
                  <p>Returned: {new Date(borrow.return_date).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
