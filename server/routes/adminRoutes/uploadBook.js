const express = require('express');
const router = express.Router();
const { getBooks, postBook, deleteBook, getNewBooks, getAmountBooks, updateBook, restockBook, restockCheckout} = require('../../controllers/uploadController');

router.get('/books', getBooks);
router.post('/books', postBook);
router.delete('/books/:id', deleteBook);
router.put('/books/:id', updateBook);
router.get('/books/newest', getNewBooks);
router.get('/books/count', getAmountBooks);
router.put('/books/restock/:id', restockBook)
router.put('/books/restock/checkout/:id', restockCheckout)

module.exports = router;