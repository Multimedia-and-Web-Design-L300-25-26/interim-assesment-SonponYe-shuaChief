# Database Configuration and MongoDB Setup (Step-by-Step)

Use this guide exactly to avoid connection mistakes.

## 1) Create your local environment file

1. Copy `.env.example` to `.env` in the project root.
2. Open `.env` and fill in real values.

Required variables:

PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES=7d
FRONTEND_ORIGIN=https://your-frontend-site.netlify.app

Important:
- Do not commit `.env` to git.
- `.gitignore` already excludes `.env`.

## 2) Create MongoDB Atlas cluster

1. Go to MongoDB Atlas: https://www.mongodb.com/atlas/database
2. Sign in (or create an account).
3. Create a new project (example name: `coinbase-clone`).
4. Click `Build a Database` and choose a free/shared tier cluster.
5. Select a cloud provider/region and create the cluster.
6. Wait for cluster status to become ready.

## 3) Create database user

1. In Atlas, open `Security` > `Database Access`.
2. Click `Add New Database User`.
3. Choose `Password` authentication.
4. Set a username and strong password.
5. Under privileges, choose `Read and write to any database` (good for this assignment).
6. Save the user.

## 4) Allow network access

1. Open `Security` > `Network Access`.
2. Click `Add IP Address`.
3. For development, choose `Allow Access from Anywhere` (`0.0.0.0/0`).
4. For production, restrict to your hosting provider IPs when possible.
.mcxxxchhxxbx
## 5) Get connection string

1. Go to `Database` > click `Connect` on your cluster.
2. Choose `Drivers`.
3. Choose `Node.js` and copy the URI.
4. Replace `<password>` in the URI with your database user password.
5. Replace `<dbname>` with `coinbase_clone`.

Example URI:

MONGO_URI=mongodb+srv://myUser:myPass@cluster0.xxxxx.mongodb.net/coinbase_clone?retryWrites=true&w=majority&appName=Cluster0

If your password contains special characters (like `@`, `#`, `/`), URL-encode it.

## 6) Configure frontend origin correctly

Set `FRONTEND_ORIGIN` to your deployed Netlify URL, for example:

FRONTEND_ORIGIN=https://my-coinbase-clone.netlify.app

For local frontend testing, use:

FRONTEND_ORIGIN=http://localhost:3000

## 7) Start and verify backend connection

1. Install dependencies:

npm install

2. Start backend:

npm run dev

3. Confirm in terminal you see:
- `MongoDB connected`
- `Server running on port 5000`

## 8) How backend reads DB config

- `config/db.js` reads `process.env.MONGO_URI` and connects with Mongoose.
- If `MONGO_URI` is missing or wrong, backend will fail to connect.

## 9) Production deployment checklist

When deploying to Render (or similar):
1. Add all env vars from `.env.example` in the hosting dashboard.
2. Set `NODE_ENV=production`.
3. Set `FRONTEND_ORIGIN` to the exact Netlify production URL.
4. Keep `JWT_SECRET` private and strong.
