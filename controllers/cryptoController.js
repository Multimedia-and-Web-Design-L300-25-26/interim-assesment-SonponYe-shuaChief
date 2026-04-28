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
    if (!name || !symbol || price == null) return res.status(400).json({ message: 'name, symbol and price required' });
    const crypto = await Crypto.create({ name, symbol, price, image, change24 });
    res.status(201).json({ message: 'Crypto created', crypto });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
