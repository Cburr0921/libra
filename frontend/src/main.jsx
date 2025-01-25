import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BrowserRouter as Router,
  UNSAFE_useScrollRestoration,
} from 'react-router-dom';
import './index.css';
import App from './pages/App/App';

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router {...router}>
      <App />
    </Router>
  </StrictMode>
);
