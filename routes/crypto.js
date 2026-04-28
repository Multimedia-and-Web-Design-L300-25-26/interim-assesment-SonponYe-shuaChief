const express = require('express');
const router = express.Router();
const { getAll, getGainers, getNew, createCrypto } = require('../controllers/cryptoController');
const auth = require('../middleware/auth');

router.get('/', getAll);
router.get('/gainers', getGainers);
router.get('/new', getNew);
router.post('/', auth, createCrypto);

module.exports = router;
