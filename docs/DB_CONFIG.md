# Database configuration and connection

Create a `.env` file at the project root with the following variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=strong_jwt_secret
JWT_EXPIRES=7d
FRONTEND_ORIGIN=https://your-frontend.netlify.app

Notes:
- Use a managed MongoDB provider (Atlas) or a hosted instance. The `MONGO_URI` must include credentials if required.
- Keep `.env` out of version control; `.gitignore` already covers it.
- For production, store secrets in your hosting provider's secrets manager.

Local development example (replace placeholders):

MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/coinbase_clone?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_random_string
FRONTEND_ORIGIN=http://localhost:3000

Connecting:
- The app uses `config/db.js` which reads `process.env.MONGO_URI` and connects with Mongoose.
