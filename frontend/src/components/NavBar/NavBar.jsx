import { NavLink, Link, useNavigate } from 'react-router-dom';
import { logOut } from '../../services/authService';
import { useState } from 'react';
import logo from '../../assets/libra-logo.svg';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  function handleLogOut() {
    logOut();
    setUser(null);
    navigate('/');
  }

  const navLinkClasses = ({ isActive }) =>
    `${isActive ? 'text-black font-semibold' : 'text-gray-600'} hover:text-black px-3 py-2 text-sm font-medium transition-colors`;

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold text-black hover:text-black">
                <img src={logo} alt="Libra Logo" className="h-8 w-8" />
                <span>Libra</span>
              </NavLink>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/" end className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/books/search" className={navLinkClasses}>
                Search Books
              </NavLink>
              {user && (
                <>
                  <NavLink to="/reviews/my" className={navLinkClasses}>
                    My Reviews
                  </NavLink>
                  <NavLink to="/borrows/my" className={navLinkClasses}>
                    My Borrows
                  </NavLink>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <button
                  onClick={handleLogOut}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-black transition-colors px-3 py-2 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${isActive ? 'bg-gray-100 text-black' : 'text-gray-600'} block px-3 py-2 text-base font-medium hover:text-black hover:bg-gray-50`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/books/search"
              className={({ isActive }) =>
                `${isActive ? 'bg-gray-100 text-black' : 'text-gray-600'} block px-3 py-2 text-base font-medium hover:text-black hover:bg-gray-50`
              }
            >
              Search Books
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/reviews/my"
                  className={({ isActive }) =>
                    `${isActive ? 'bg-gray-100 text-black' : 'text-gray-600'} block px-3 py-2 text-base font-medium hover:text-black hover:bg-gray-50`
                  }
                >
                  My Reviews
                </NavLink>
                <NavLink
                  to="/borrows/my"
                  className={({ isActive }) =>
                    `${isActive ? 'bg-gray-100 text-black' : 'text-gray-600'} block px-3 py-2 text-base font-medium hover:text-black hover:bg-gray-50`
                  }
                >
                  My Borrows
                </NavLink>
              </>
            )}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            {user ? (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <div className="text-base font-medium text-gray-800">Welcome, {user.name}</div>
                </div>
                <button
                  onClick={handleLogOut}
                  className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-black"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  to="/login"
                  className="block text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-black px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="block text-base font-medium text-black hover:bg-gray-100 px-3 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}