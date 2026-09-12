import { Capacitor } from '@capacitor/core';

// Where the backend lives.
//
// Browser dev (`npm run dev`): leave VITE_API_BASE unset. '/api' is relative to
// the Vite dev server, which proxies it to localhost:5000 (see vite.config.js).
//
// Android build: the packaged app has no dev server and no proxy, so a relative
// '/api' resolves against the WebView's own origin (https://localhost) and every
// request fails. Set VITE_API_BASE in frontend/.env to the backend's address as
// reachable *from the phone* - your machine's LAN IP, not localhost - then
// rebuild with `npm run cap:build`. See frontend/.env.example.
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

if (Capacitor.isNativePlatform() && !import.meta.env.VITE_API_BASE) {
  console.warn(
    '[api] VITE_API_BASE is not set, so API calls will fail on device. ' +
    'Set it in frontend/.env and re-run `npm run cap:build`.'
  );
}

export const api = {
  // Connectivity probe - useful for diagnosing device -> backend reachability.
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Backend unreachable (HTTP ${res.status})`);
    return res.json();
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All Crafts') query.append('category', params.category);
    if (params.giOnly) query.append('giOnly', 'true');
    if (params.search) query.append('search', params.search);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async addProductReview(id, review) {
    const res = await fetch(`${API_BASE}/products/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  // Artisans
  async getArtisans() {
    const res = await fetch(`${API_BASE}/artisans`);
    if (!res.ok) throw new Error('Failed to fetch artisans');
    return res.json();
  },

  // Orders & Escrow
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async getOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order status');
    return res.json();
  },

  // Authentication
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async googleAuth(profile) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Google authentication failed');
    return data;
  },

  async getProfile(token) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  // Price Recommendation (ML-powered dynamic pricing)
  async getRecommendedPrice({ category, description, rating, brand }) {
    const res = await fetch(`${API_BASE}/pricing/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, description, rating: rating || null, brand: brand || null })
    });
    if (!res.ok) throw new Error('Failed to get price recommendation');
    return res.json();
  },

  // --- AI cataloging -------------------------------------------------------

  // Spoken transcript (Hindi, English or a mix) -> title, description,
  // bullets, SEO keywords and a category.
  async catalogFromVoice({ transcript, category }) {
    const res = await fetch(`${API_BASE}/ml/catalog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, category: category || null })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not build the listing');
    return data.data;
  },

  // Phone photo -> listing-grade image on a clean background.
  // `imageBase64` may be a bare base64 string or a full data: URI.
  async enhanceImage({ imageBase64, removeBackground = true }) {
    const res = await fetch(`${API_BASE}/ml/enhance-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: imageBase64, remove_background: removeBackground })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not enhance the photo');
    return data.data;
  },

  // The whole artisan flow in one call: speak, optionally attach a photo, get
  // back a complete draft listing (copy + category + price band + image).
  // Individual stages degrade independently - check `warnings` in the result.
  async draftListing({ transcript, imageBase64, category, removeBackground = true }) {
    const res = await fetch(`${API_BASE}/ml/listing/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript,
        image_base64: imageBase64 || null,
        category: category || null,
        remove_background: removeBackground
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not draft the listing');
    return data.data;
  }
};
