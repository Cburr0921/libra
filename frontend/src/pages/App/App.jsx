import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../services/authService';
import './App.css';
import HomePage from '../HomePage/HomePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import BookDetailsPage from '../BookDetailsPage/BookDetailsPage';
import BookSearchPage from '../BookSearchPage/BookSearchPage';
import ReviewPage from '../ReviewPage/ReviewPage';
import MyReviewsPage from '../MyReviewsPage/MyReviewsPage';
import MyBorrowsPage from '../MyBorrowsPage/MyBorrowsPage';
import EditReviewPage from '../EditReviewPage/EditReviewPage';

export default function App() {
  const [user, setUser] = useState(getUser());
  
  return (
    <main className="App min-h-screen flex flex-col">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section" className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/books/search" element={<BookSearchPage />} />
          <Route path="/books/works/:id" element={<BookDetailsPage user={user} />} />
          <Route path="/reviews/works/:id" element={<ReviewPage user={user} />} />
          <Route path="/reviews/my" element={<MyReviewsPage user={user} />} />
          <Route path="/reviews/:reviewId/edit" element={<EditReviewPage user={user} />} />
          <Route path="/borrows/my" element={<MyBorrowsPage user={user} />} />
          <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
          <Route path="/login" element={<LogInPage setUser={setUser} />} />
          
          {/* Protected Routes */}
          {/* Fallback Route */}
          <Route path="*" element={<HomePage user={user} />} />
        </Routes>
      </section>
      <Footer />
    </main>
  );
}
