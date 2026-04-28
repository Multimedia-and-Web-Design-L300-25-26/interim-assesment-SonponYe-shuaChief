# API Endpoints (for frontend integration)

Base URL: `https://<your-backend-domain>/api` (or `http://localhost:5000/api` for local)

Auth
- POST `/api/auth/register` — body: `{ name, email, password }` — registers user, sets HTTP-only cookie `token`.
- POST `/api/auth/login` — body: `{ email, password }` — logs in, sets HTTP-only cookie `token`.
- GET `/api/auth/profile` — protected — returns `{ id, name, email }`.

Crypto
- GET `/api/crypto` — returns all cryptocurrencies.
- GET `/api/crypto/gainers` — returns top gainers sorted by 24h change desc.
- GET `/api/crypto/new` — returns newest listings sorted by createdAt desc.
- POST `/api/crypto` — protected — body: `{ name, symbol, price, image, change24 }` — creates a new crypto.

Authentication details
- The backend sets a JWT in an HTTP-only cookie named `token`. The frontend should include credentials when making requests to protected endpoints; for fetch use `credentials: 'include'` and ensure `FRONTEND_ORIGIN` is configured.
- Alternatively, the frontend can read the token from login response and send it in the `Authorization: Bearer <token>` header.

Example fetch for protected route (frontend):

fetch('https://your-backend/api/auth/profile', { credentials: 'include' })

Response formats are JSON. Error responses use `{ message: '...', error?: '...' }`.
