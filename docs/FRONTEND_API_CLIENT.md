# Frontend API Client

Paste this into your frontend app as a shared API layer.

Recommended file path:
- `src/api/client.js`

This keeps the backend URL in one place and automatically sends cookies for authenticated requests.

## 1) Fetch version

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  register: (payload) => api('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  login: (payload) => api('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  profile: () => api('/auth/profile')
};

export const cryptoApi = {
  getAll: () => api('/crypto'),
  getGainers: () => api('/crypto/gainers'),
  getNew: () => api('/crypto/new'),
  create: (payload) => api('/crypto', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
```

## 2) Axios version

If your frontend already uses axios, use this instead:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  profile: () => api.get('/auth/profile')
};

export const cryptoApi = {
  getAll: () => api.get('/crypto'),
  getGainers: () => api.get('/crypto/gainers'),
  getNew: () => api.get('/crypto/new'),
  create: (payload) => api.post('/crypto', payload)
};
```

## 3) Frontend env variable

```env
VITE_API_BASE_URL=https://your-backend-domain/api
```

If you are using React + Vite, put that in your frontend `.env` or in Netlify environment variables.

## 4) How to use it in pages

```js
import { authApi, cryptoApi } from './api';

const me = await authApi.profile();
const markets = await cryptoApi.getAll();
```

### Login page

```js
import { authApi } from '../api/client';

async function handleLogin(email, password) {
  try {
    await authApi.login({ email, password });
    const me = await authApi.profile();
    setUser(me);
    navigate('/profile');
  } catch (error) {
    setError(error.status === 401 ? 'Invalid credentials' : error.message);
  }
}
```

### Register page

```js
import { authApi } from '../api/client';

async function handleRegister(name, email, password) {
  try {
    await authApi.register({ name, email, password });
    const me = await authApi.profile();
    setUser(me);
    navigate('/profile');
  } catch (error) {
    setError(error.message);
  }
}
```

### Profile page

```js
import { authApi } from '../api/client';

useEffect(() => {
  async function loadProfile() {
    try {
      const me = await authApi.profile();
      setUser(me);
    } catch (error) {
      if (error.status === 401) navigate('/login');
    }
  }

  loadProfile();
}, []);
```

### Crypto list page

```js
import { cryptoApi } from '../api/client';

useEffect(() => {
  async function loadCrypto() {
    const data = await cryptoApi.getAll();
    setCryptos(data);
  }

  loadCrypto();
}, []);
```

### Add crypto form

```js
import { cryptoApi } from '../api/client';

async function handleAddCrypto(formValues) {
  try {
    await cryptoApi.create(formValues);
    const updated = await cryptoApi.getNew();
    setCryptos(updated);
  } catch (error) {
    if (error.status === 401) navigate('/login');
    setError(error.message);
  }
}
```

## 5) Error handling pattern

```js
try {
  await authApi.login({ email, password });
  navigate('/');
} catch (error) {
  if (error.status === 401) {
    setError('Invalid credentials');
    return;
  }
  setError(error.message);
}
```

## 6) Notes

- Keep `credentials: 'include'` enabled for cookie-based auth.
- Do not store the JWT in localStorage if you are relying on HTTP-only cookies.
- Use the same `VITE_API_BASE_URL` in every request.
- Your backend endpoints are:
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/auth/profile`
  - `/api/crypto`
  - `/api/crypto/gainers`
  - `/api/crypto/new`