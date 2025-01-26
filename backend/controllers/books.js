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
    res.json(data);  // Return the raw response from OpenLibrary
  } catch (err) {
    res.status(500).json({ error: 'Failed to search books' });
  }
}

async function show(req, res) {
  try {
    // Extract the work ID from the URL parameters
    const idParam = req.params.id;
    
    // Extract just the ID part if it includes /works/
    const workId = idParam.match(/OL\d+W/)?.[0];
    
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
    
    const bookData = await response.json();
    
    // Get the first author key if available
    const authorKey = bookData.authors?.[0]?.author?.key;
    let authorName = 'Unknown Author';
    
    if (authorKey) {
      // Fetch author details
      const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
      if (authorResponse.ok) {
        const authorData = await authorResponse.json();
        authorName = authorData.name || authorName;
      }
    }
    
    // Get the cover ID if available
    const coverId = bookData.covers?.[0];
    
    // Format the response
    const formattedBook = {
      openLibraryId: `/works/${workId}`,
      title: bookData.title,
      author: authorName,
      description: bookData.description?.value || bookData.description || '',
      coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null,
      publishDate: bookData.first_publish_date || 'Unknown',
      subjects: bookData.subjects || []
    };
    
    res.json(formattedBook);
  } catch (err) {
    console.error('Error fetching book details:', err);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
}
