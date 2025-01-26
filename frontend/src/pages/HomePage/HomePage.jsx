import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch active borrows if user is logged in
    if (user) {
      fetch('/api/borrows/user', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        const active = data.filter(borrow => !borrow.is_returned);
        setActiveBorrows(active);
      })
      .catch(console.error);
    }

    // Fetch all recent reviews
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setRecentReviews(Array.isArray(data) ? data : []);
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
    <div className="HomePage">
      <section className="hero">
        <h1>Welcome to Libra</h1>
        <p>Your digital library companion</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {user && activeBorrows.length > 0 && (
        <section className="active-borrows">
          <h2>Your Current Borrows</h2>
          <div className="borrow-list">
            {activeBorrows.map(borrow => (
              <div key={borrow._id} className="borrow-item">
                <h3>{borrow.title}</h3>
                <p>Due: {new Date(borrow.due_date).toLocaleDateString()}</p>
                <Link to={`/books/works/${borrow.book_api_id.split('/').pop()}`}>View Book</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {recentReviews.length > 0 && (
        <section className="recent-reviews">
          <h2>Recent Reviews</h2>
          <div className="review-list">
            {recentReviews.map(review => (
              <div key={review._id} className="review-item">
                <h3>{review.title}</h3>
                <p>by {review.author}</p>
                <div className="rating">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                <p>{review.review.substring(0, 150)}...</p>
                <Link to={`/books/works/${review.openLibraryId.replace(/^\/works\//, '')}`}>View Book</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="cta">
        <h2>Start Your Reading Journey</h2>
        {user ? (
          <Link to="/books/search" className="cta-button">Browse Books</Link>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="cta-button">Log In</Link>
            <Link to="/signup" className="cta-button">Sign Up</Link>
         </div>
        )}
      </section>
    </div>
  );
}