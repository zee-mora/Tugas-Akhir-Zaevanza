const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');

router.get('/home', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to Home Page' });
});

module.exports = router;
