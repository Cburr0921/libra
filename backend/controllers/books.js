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
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search books' });
  }
}

async function show(req, res) {
  try {
    const bookId = req.bookId;
    
    if (!bookId || !bookId.match(/OL\d+W/)) {
      return res.status(400).json({ error: 'Invalid OpenLibrary ID format' });
    }

    // Fetch book data
    const workUrl = `https://openlibrary.org/works/${bookId}.json`;
    const bookResponse = await fetch(workUrl);
    
    if (!bookResponse.ok) {
      return res.status(bookResponse.status).json({ error: 'Failed to fetch book' });
    }

    const bookData = await bookResponse.json();

    // Get author data
    let authorName = 'Unknown Author';
    if (bookData.authors && bookData.authors.length > 0) {
      const author = bookData.authors[0];
      const authorKey = author.author?.key || author.key;

      if (authorKey) {
        const authorUrl = `https://openlibrary.org${authorKey}.json`;
        const authorResponse = await fetch(authorUrl);
        
        if (authorResponse.ok) {
          const authorData = await authorResponse.json();
          authorName = authorData.name || authorData.personal_name || 'Unknown Author';
        }
      }
    }

    // Format response
    const formattedBook = {
      openLibraryId: `/works/${bookId}`,
      title: bookData.title,
      author: authorName,
      description: typeof bookData.description === 'object' ? 
                  bookData.description.value || '' : 
                  bookData.description || '',
      coverUrl: bookData.covers ? 
                `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg` : 
                null,
      publishDate: bookData.first_publish_date || 'Unknown',
      subjects: bookData.subjects || []
    };

    res.json(formattedBook);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
}
