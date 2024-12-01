const express = require('express');
const { contactAdmin, deleteMessage, getMessage } = require('../controllers/contactAdmin');

const router = express.Router();

router.post('/feedback', contactAdmin);
router.get('/feedback', getMessage);
router.delete('/feedback/:id', deleteMessage);

module.exports = router;