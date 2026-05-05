require('dotenv').config();
const mongoose = require('mongoose');
const Crypto = require('../models/Crypto');

const cryptoSeedData = [
  { name: 'Bitcoin', symbol: 'BTC', price: 64250.12, image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', change24: 2.45 },
  { name: 'Ethereum', symbol: 'ETH', price: 3165.84, image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', change24: 3.92 },
  { name: 'Solana', symbol: 'SOL', price: 151.73, image: 'https://cryptologos.cc/logos/solana-sol-logo.png', change24: 5.61 },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.1672, image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png', change24: 7.14 },
  { name: 'Cardano', symbol: 'ADA', price: 0.5281, image: 'https://cryptologos.cc/logos/cardano-ada-logo.png', change24: 1.88 },
  { name: 'XRP', symbol: 'XRP', price: 0.6123, image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', change24: -0.94 },
  { name: 'BNB', symbol: 'BNB', price: 589.44, image: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', change24: 2.11 },
  { name: 'Avalanche', symbol: 'AVAX', price: 36.27, image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', change24: 4.28 },
  { name: 'Polkadot', symbol: 'DOT', price: 8.15, image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', change24: 0.67 },
  { name: 'Chainlink', symbol: 'LINK', price: 18.33, image: 'https://cryptologos.cc/logos/chainlink-link-logo.png', change24: 2.98 },
  { name: 'Litecoin', symbol: 'LTC', price: 84.92, image: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', change24: -1.35 },
  { name: 'Polygon', symbol: 'MATIC', price: 0.8215, image: 'https://cryptologos.cc/logos/polygon-matic-logo.png', change24: 6.09 },
  { name: 'Uniswap', symbol: 'UNI', price: 11.42, image: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', change24: 1.44 },
  { name: 'Aptos', symbol: 'APT', price: 10.87, image: 'https://cryptologos.cc/logos/aptos-apt-logo.png', change24: 3.55 },
  { name: 'Arbitrum', symbol: 'ARB', price: 1.16, image: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', change24: 4.02 },
  { name: 'Toncoin', symbol: 'TON', price: 6.52, image: 'https://cryptologos.cc/logos/toncoin-ton-logo.png', change24: 2.73 },
  { name: 'Pepe', symbol: 'PEPE', price: 0.0000114, image: 'https://cryptologos.cc/logos/pepe-pepe-logo.png', change24: 12.61 },
  { name: 'Shiba Inu', symbol: 'SHIB', price: 0.0000241, image: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png', change24: 8.37 },
  { name: 'Near Protocol', symbol: 'NEAR', price: 7.11, image: 'https://cryptologos.cc/logos/near-protocol-near-logo.png', change24: 3.12 },
  { name: 'Render', symbol: 'RNDR', price: 10.24, image: 'https://cryptologos.cc/logos/render-rndr-logo.png', change24: 5.33 }
];

const getMongoUri = () => process.env.MONGO_URI || process.env.MONGODB_URI;

const seedCrypto = async () => {
  const mongoUri = getMongoUri();
  if (!mongoUri) {
    console.error('Missing MONGO_URI or MONGODB_URI in environment.');
    process.exit(1);
  }

  const shouldClearFirst = process.argv.includes('--fresh');

  try {
    await mongoose.connect(mongoUri);

    if (shouldClearFirst) {
      await Crypto.deleteMany({});
      console.log('Existing crypto collection cleared.');
    }

    const operations = cryptoSeedData.map((coin) => ({
      updateOne: {
        filter: { symbol: coin.symbol },
        update: { $set: coin },
        upsert: true
      }
    }));

    const result = await Crypto.bulkWrite(operations);
    const total = await Crypto.countDocuments();

    console.log(`Seed complete. Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}, Total records: ${total}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore secondary disconnect errors.
    }
    process.exit(1);
  }
};

seedCrypto();
