# Frontend Handoff Guide

Use this guide to apply backend changes safely in your Netlify-hosted frontend.

## 1) Set frontend environment variables

Create/update your frontend `.env` (or Netlify Environment Variables):

VITE_API_BASE_URL=https://your-backend-domain/api

If your frontend is not using Vite, use the env pattern for your framework (for example `REACT_APP_API_BASE_URL`).

## 2) Create one API client (single source of truth)

Create a shared API utility so all requests use the same base URL and credentials policy.

Example with `fetch`:

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

## 3) Map frontend pages to backend endpoints

1. Register page
   - POST `/auth/register`
   - Body: `{ name, email, password }`
2. Login page
   - POST `/auth/login`
   - Body: `{ email, password }`
3. Profile/dashboard page (protected)
   - GET `/auth/profile`
   - On `401`, redirect user to login
4. Crypto market listing
   - GET `/crypto`
5. Top gainers section
   - GET `/crypto/gainers`
6. New listings section
   - GET `/crypto/new`
7. Add crypto form (protected)
   - POST `/crypto`
   - Body: `{ name, symbol, price, image, change24 }`

All paths above are relative to `VITE_API_BASE_URL`, for example:
- `https://your-backend-domain/api/auth/login`
- `https://your-backend-domain/api/crypto/gainers`

## 4) Authentication behavior to implement

1. After successful register/login, call `/auth/profile` to confirm active session.
2. Store only user profile in state (do not store JWT in localStorage when using HTTP-only cookies).
3. Add a global `401` handler in your API layer to redirect to login.
4. Keep `credentials: 'include'` enabled for protected requests.

## 5) CORS and deployment alignment checklist

1. Backend `FRONTEND_ORIGIN` must exactly match your Netlify URL.
2. Frontend `VITE_API_BASE_URL` must point to your deployed backend `/api` root.
3. If backend is HTTPS (recommended), frontend must call HTTPS endpoint.
4. Re-deploy frontend after updating environment variables.

## 6) Error handling contract

Backend returns JSON errors in this shape:

{ "message": "...", "error": "...optional..." }

Frontend should:
1. Display `message` to user.
2. Log `error` only for debugging.
3. Handle `401` as unauthenticated session.

## 7) Smoke test sequence (frontend)

1. Register a new user.
2. Login with that user.
3. Open profile page and confirm name/email render.
4. Load `/crypto`, `/crypto/gainers`, and `/crypto/new` sections.
5. Submit add-crypto form while logged in.
6. Confirm new item appears in crypto/new listing.

## 8) Quick endpoint reference

See the endpoint list in [docs/ENDPOINTS.md](docs/ENDPOINTS.md).