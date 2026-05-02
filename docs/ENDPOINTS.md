# API Endpoints (for frontend integration)

Base URL: `https://<your-backend-domain>/api` (or `http://localhost:5000/api` for local)

Auth
- POST `/api/auth/register` — body: `{ name, email, password }` — registers user, sets HTTP-only cookie `token`.
- POST `/api/auth/signup` — compatibility alias for register.
- POST `/api/auth/login` — body: `{ email, password }` — logs in, sets HTTP-only cookie `token`.
- POST `/api/auth/signin` — compatibility alias for login.
- GET `/api/auth/profile` — protected — returns `{ id, name, email }`.

Note: The login and register endpoints now also return the JWT token in the response body as `token`. Frontend may use this token in an `Authorization: Bearer <token>` header if cookies are not available (for example during local dev when backend is HTTP and frontend is HTTPS).

Register payload note:
- The backend accepts `name`, `fullName`, or `username`.
- If none are provided, it falls back to the email username part before `@`.

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

Frontend migration checklist
1. Set frontend API base URL to your backend `/api` root.
2. Ensure protected requests are sent with credentials (`credentials: 'include'`).
3. Redirect to login when `/api/auth/profile` returns `401`.
4. Use endpoint payload keys exactly as documented.
5. Confirm backend `FRONTEND_ORIGIN` matches your Netlify domain.

Detailed implementation handoff
- See [docs/FRONTEND_HANDOFF.md](docs/FRONTEND_HANDOFF.md) for full integration flow and testing steps.
