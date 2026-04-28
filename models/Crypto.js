const mongoose = require('mongoose');

const CryptoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    change24: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crypto', CryptoSchema);
