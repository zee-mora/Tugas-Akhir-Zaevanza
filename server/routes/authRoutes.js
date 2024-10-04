const express = require('express');
const { loginuser } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginuser);

module.exports = router;