const express = require('express');
const router = express.Router();
const { getCart } = require('./../../controllers/cartController');

router.get('/debug', getCart);

module.exports = router;