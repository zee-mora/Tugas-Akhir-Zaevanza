const express = require('express');
const { getAuthors, postAuthor, deleteAuthor, updateAuthor } = require('../../controllers/authorController');
const router = express.Router();

router.get('/authors/', getAuthors);
router.post('/authors/', postAuthor);
router.delete('/authors/:id', deleteAuthor);
router.put('/authors/:id', updateAuthor);

module.exports = router;