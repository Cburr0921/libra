import { getToken } from './authService';

const BASE_URL = '/api/wishlists';

export async function addToWishlist(bookId, bookTitle, bookAuthor) {
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
    return res.json();
  } else {
    const err = await res.json();
    throw new Error(err.message || 'Failed to add to wishlist');
  }
}

export async function getUserWishlist() {
  const res = await fetch(BASE_URL, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch wishlist');
  }
}

export async function removeFromWishlist(wishlistItemId) {
  const res = await fetch(`${BASE_URL}/${wishlistItemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to remove from wishlist');
  }
}
