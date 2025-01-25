const Review = require('../models/review');

module.exports = {
  search,
  show
};

async function search(req, res) {
  try {
    const query = encodeURIComponent(req.query.q);
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    if (!response.ok) throw new Error('Failed to fetch from OpenLibrary');
    
    const data = await response.json();
    const books = data.docs.slice(0, 10).map(book => ({
      openLibraryId: book.key,
      title: book.title,
      author: book.author_name?.[0] || 'Unknown Author',
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
      publishYear: book.first_publish_year || 'Unknown'
    }));
    
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search books' });
  }
}

async function show(req, res) {
  try {
    const response = await fetch(`https://openlibrary.org${req.params.id}.json`);
    if (!response.ok) throw new Error('Failed to fetch book details');
    
    const data = await response.json();
    const bookDetails = {
      openLibraryId: data.key,
      title: data.title,
      author: data.authors?.[0]?.name || 'Unknown Author',
      description: data.description?.value || data.description || 'No description available',
      publishDate: data.first_publish_date || 'Unknown',
      coverUrl: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : null,
      subjects: data.subjects || []
    };
    
    res.json(bookDetails);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
}
