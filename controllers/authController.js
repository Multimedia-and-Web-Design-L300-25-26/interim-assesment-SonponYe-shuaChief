const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, fullName, username, email, password } = req.body;
    
    // Try to resolve name from multiple possible field names
    const resolvedName = (name || fullName || username || email?.split('@')?.[0] || '').trim();
    
    // Validate all required fields with specific error messages
    if (!resolvedName) {
      return res.status(400).json({ 
        message: 'Name is required',
        details: 'Please provide name, fullName, or username'
      });
    }
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required',
        details: 'Please provide a valid email address'
      });
    }
    if (!password) {
      return res.status(400).json({ 
        message: 'Password is required',
        details: 'Please provide a password'
      });
    }
    
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ 
        message: 'Email already registered',
        details: `A user with email ${email} already exists`
      });
    }
    
    // Create new user
    const user = await User.create({ name: resolvedName, email, password });
    const token = signToken(user);
    
    // Set cookie for browsers (cross-site cookies require SameSite=None and Secure in production)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    
    // Also return token in response body so frontend can use Authorization header if needed
    res.status(201).json({ 
      message: 'User registered successfully',
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error during registration',
      error: err.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required',
        details: 'Please provide your email address'
      });
    }
    if (!password) {
      return res.status(400).json({ 
        message: 'Password is required',
        details: 'Please provide your password'
      });
    }
    
    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }
    
    // Generate token and set cookie
    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    
    res.json({ 
      message: 'Logged in successfully',
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error during login',
      error: err.message 
    });
  }
};

exports.profile = async (req, res) => {
  const user = req.user;
  res.json({ id: user._id, name: user.name, email: user.email });
};
