const express = require('express');
const router = express.Router();
const { getBooks, postBook, deleteBook, getNewBooks, getAmountBooks } = require('../../controllers/uploadController');

router.get('/books', getBooks);
router.post('/books', postBook);
router.delete('/books/:id', deleteBook);
router.get('/books/newest', getNewBooks);
router.get('/books/count', getAmountBooks);

module.exports = router;