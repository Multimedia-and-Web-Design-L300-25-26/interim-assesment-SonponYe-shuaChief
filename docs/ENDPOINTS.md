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

## CORS & Environment Configuration (Critical for Deployment)

**IMPORTANT**: For the backend to accept requests from your frontend, you must configure the following environment variables on your deployment platform (e.g., Render, Heroku):

### Required Environment Variables

Set these in your deployment platform's environment settings:

```
FRONTEND_ORIGIN=https://dcit323ia.netlify.app
JWT_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-connection-string
NODE_ENV=production
```

**Note**: 
- `FRONTEND_ORIGIN` can accept a single domain or comma-separated multiple domains (e.g., `https://dcit323ia.netlify.app,http://localhost:3000`)
- The backend will only accept requests from the domain(s) specified in `FRONTEND_ORIGIN`
- CORS preflight (OPTIONS) requests are automatically handled for all routes
- All requests from the specified origin will include the necessary CORS headers:
  - `Access-Control-Allow-Origin`: matches your frontend origin
  - `Access-Control-Allow-Credentials: true` (for cookies/auth)
  - `Access-Control-Allow-Headers: Content-Type, Authorization`
  - `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`

### Troubleshooting CORS Issues

If you see CORS errors in the browser console:

1. **Verify the frontend domain** matches exactly in `FRONTEND_ORIGIN` (including `https://` or `http://`)
2. **Check environment variables** are set on your deployment platform (not just locally in `.env`)
3. **Ensure credentials are included** in fetch requests: `fetch(url, { credentials: 'include' })`
4. **If using Authorization header** instead of cookies, ensure it's set: `headers: { 'Authorization': 'Bearer <token>' }`

Detailed implementation handoff
- See [docs/FRONTEND_HANDOFF.md](docs/FRONTEND_HANDOFF.md) for full integration flow and testing steps.
