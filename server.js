require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
};
app.use(cors(corsOptions));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crypto', require('./routes/crypto'));

app.get('/', (req, res) => res.json({ ok: true, message: 'Coinbase clone backend' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
