const Crypto = require('../models/Crypto');

exports.getAll = async (req, res) => {
  try {
    const list = await Crypto.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getGainers = async (req, res) => {
  try {
    const list = await Crypto.find().sort({ change24: -1 }).limit(50);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getNew = async (req, res) => {
  try {
    const list = await Crypto.find().sort({ createdAt: -1 }).limit(50);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24 } = req.body;
    
    // Validate required fields with specific error messages
    if (!name) {
      return res.status(400).json({ 
        message: 'Name is required',
        details: 'Please provide a cryptocurrency name'
      });
    }
    if (!symbol) {
      return res.status(400).json({ 
        message: 'Symbol is required',
        details: 'Please provide a cryptocurrency symbol (e.g., BTC)'
      });
    }
    if (price == null) {
      return res.status(400).json({ 
        message: 'Price is required',
        details: 'Please provide a valid price'
      });
    }
    
    // Create cryptocurrency
    const crypto = await Crypto.create({ name, symbol, price, image, change24 });
    res.status(201).json({ 
      message: 'Crypto created successfully',
      crypto 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error during crypto creation',
      error: err.message 
    });
  }
};
