import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './pages/App/App';

const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={routerOptions.future}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
