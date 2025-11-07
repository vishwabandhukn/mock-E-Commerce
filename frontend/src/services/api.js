const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get('content-type');
  const isJSON = contentType && contentType.includes('application/json');
  const payload = isJSON ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(payload?.message || 'Request failed');
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  return payload;
}

export function getProducts() {
  return request('/api/products');
}

export function getCart() {
  return request('/api/cart');
}

export function addToCart(productId, quantity = 1) {
  return request('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  });
}

export function removeFromCart(productId) {
  return request(`/api/cart/${productId}`, { method: 'DELETE' });
}

export function checkout(payload) {
  return request('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function healthcheck() {
  return request('/api/health');
}

