import sendRequest from './sendRequest';

const BASE_URL = '/api/books';

export async function index() {
  return sendRequest(BASE_URL);
}

export async function search(query) {
  return sendRequest(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
}

export async function show(bookId) {
  // Extract just the ID part if it includes /works/
  const cleanId = bookId.replace(/^\/works\//, '');
  return sendRequest(`${BASE_URL}/${cleanId}`);
}

// Add more book-related API calls as needed
