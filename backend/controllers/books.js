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
      openLibraryId: book.key.split('/').pop(),
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
    // Extract the work ID from the URL parameters
    const idParam = req.params.id;
    
    // Extract just the ID part if it includes /works/
    const workId = idParam.replace(/^\/works\//, '').match(/OL\d+W/)?.[0];
    
    if (!workId) {
      console.error('Invalid OpenLibrary ID format:', idParam);
      return res.status(400).json({ error: 'Invalid OpenLibrary ID format' });
    }

    // Fetch initial book data
    let response = await fetch(`https://openlibrary.org/works/${workId}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Book not found' });
      }
      throw new Error(`Failed to fetch book details: ${response.status}`);
    }
    
    let bookData = await response.json();

    // Handle redirects
    if (bookData.type?.key === '/type/redirect' && bookData.location) {
      const redirectId = bookData.location.replace(/^\/works\//, '');
      response = await fetch(`https://openlibrary.org/works/${redirectId}.json`);
      
      if (!response.ok) {
        console.error('Redirect failed:', response.status);
        throw new Error(`Failed to fetch redirected book details: ${response.status}`);
      }
      
      bookData = await response.json();
    }
    
    // Get author details if available
    let authorName = 'Unknown Author';
    if (bookData.authors && bookData.authors.length > 0) {
      try {
        // OpenLibrary sometimes provides authors in different formats
        const authorKey = bookData.authors[0]?.author?.key || bookData.authors[0]?.key;
        
        if (authorKey) {
          const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
          if (authorResponse.ok) {
            const authorData = await authorResponse.json();
            authorName = authorData.name || authorData.personal_name || 'Unknown Author';
          } else {
            console.error('Failed to fetch author:', authorResponse.status);
          }
        }
      } catch (err) {
        console.error('Error fetching author details:', err);
      }
    }

    // Handle different description formats
    let description = 'No description available';
    if (typeof bookData.description === 'string') {
      description = bookData.description;
    } else if (bookData.description?.value) {
      description = bookData.description.value;
    } else if (bookData.excerpts && bookData.excerpts.length > 0) {
      description = bookData.excerpts[0].excerpt;
    }

    const bookDetails = {
      openLibraryId: `/works/${workId}`,
      title: bookData.title || 'Untitled',
      author: authorName,
      description: description,
      publishDate: bookData.first_publish_date || bookData.publish_date || 'Unknown',
      coverUrl: bookData.covers?.[0] ? `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg` : null,
      subjects: bookData.subjects || []
    };
    
    res.json(bookDetails);
  } catch (err) {
    console.error('Error in show controller:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch book details' });
  }
}
