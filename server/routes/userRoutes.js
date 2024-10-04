const express = require('express');
const { getUsers, postUser } = require('../controllers/userController');

const router = express.Router();

router.get('/users', getUsers);
router.post('/users', postUser);

module.exports = router;