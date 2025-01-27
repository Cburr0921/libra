import { NavLink, Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { logOut } from '../../services/authService';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();
  
  function handleLogOut() {
    logOut();
    setUser(null);
    navigate('/');
  }
  return (
    <nav className="NavBar">
      <NavLink to="/" end>
        Home
      </NavLink>
      {user ? (
        <>
          &nbsp; | &nbsp;
          <NavLink to="/books/search">Search Books</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/reviews/my">My Reviews</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/borrows/my">My Borrows</NavLink>
          &nbsp; | &nbsp;
          <span>Welcome, {user.name}</span>
          &nbsp; | &nbsp;
          <Link to="" onClick={handleLogOut}>
            Log Out
          </Link>
        </>
      ) : (
        <>
          &nbsp; | &nbsp;
          <NavLink to="/login">Log In</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
    </nav>
  );
}