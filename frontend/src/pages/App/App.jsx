import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../services/authService';
import './App.css';
import HomePage from '../HomePage/HomePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';
import BookDetailsPage from '../BookDetailsPage/BookDetailsPage';
import BookSearchPage from '../BookSearchPage/BookSearchPage';

export default function App() {
  const [user, setUser] = useState(getUser());
  
  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/books/search" element={<BookSearchPage />} />
          <Route path="/books/works/:id" element={<BookDetailsPage />} />
          <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
          <Route path="/login" element={<LogInPage setUser={setUser} />} />

          {/* Fallback Route */}
          <Route path="*" element={<HomePage user={user} />} />
        </Routes>
      </section>
    </main>
  );
}
