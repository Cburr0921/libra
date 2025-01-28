import { getToken } from './authService';

// Make sure we're using the API URL
const BASE_URL = '/api/borrows';

export async function createBorrow(bookId, bookTitle, bookAuthor) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        book_api_id: bookId,
        book_title: bookTitle,
        book_author: bookAuthor
      })
    });
    
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error('Failed to borrow book');
    }
  } catch (err) {
    throw err;
  }
}

export async function getUserBorrows() {
  try {
    const res = await fetch(`${BASE_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error('Failed to fetch user borrows');
    }
  } catch (err) {
    throw err;
  }
}

export async function returnBook(borrowId) {
  try {
    const res = await fetch(`${BASE_URL}/${borrowId}/return`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      // Show notification to users if any
      if (data.notifications && data.notifications.length > 0) {
        // In a real app, we'd handle these notifications better
        console.log('Book availability notifications:', data.notifications);
      }
      return data.borrow;
    } else {
      throw new Error('Failed to return book');
    }
  } catch (err) {
    throw err;
  }
}
