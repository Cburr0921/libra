const path = require('path'); // Built into Node
const express = require('express');
const logger = require('morgan');
const app = express();

// Process the secrets/config vars in .env
require('dotenv').config();

// Connect to the database
require('./db');

app.use(logger('dev'));

// Disable caching for API routes
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Expires', '-1');
  res.set('Pragma', 'no-cache');
  next();
});

// Serve static assets from the frontend's built code folder (dist)
app.use(express.static(path.join(__dirname, '../frontend/dist'), {
  etag: false,
  lastModified: false
}));

app.use(express.json());

// Public API Routes (no auth required)
app.use('/api/books', require('./routes/books'));

// Optional token checking - will set req.user if token is valid
app.use(require('./middleware/checkToken'));

// Protected API Routes (auth required)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/borrows', require('./routes/borrows'));
app.use('/api/wishlists', require('./routes/wishlists'));

//All routers below will be protected 
app.use(require('./middleware/ensureLoggedIn'));

// Use a "catch-all" route to deliver the frontend's production index.html
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is listening on ${port}`);
});