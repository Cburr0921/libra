import sendRequest from './sendRequest';

const BASE_URL = '/api/reviews';

export async function index() {
  return sendRequest(BASE_URL);
}

export async function getMyReviews() {
  return sendRequest(`${BASE_URL}?my=true`);
}

export async function show(reviewId) {
  return sendRequest(`${BASE_URL}/detail/${reviewId}`);
}

export async function create(reviewData) {
  return sendRequest(BASE_URL, 'POST', reviewData);
}

export async function update(reviewId, reviewData) {
  return sendRequest(`${BASE_URL}/${reviewId}`, 'PUT', reviewData);
}

export async function deleteReview(reviewId) {
  return sendRequest(`${BASE_URL}/${reviewId}`, 'DELETE');
}
