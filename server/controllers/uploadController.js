const Book = require('../models/bookModel')
const Author = require('../models/authorModel')
const multer = require('multer');
const upload = require('../middlewares/upload')

const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('author');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const postBook = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { title, author, price, description, stock } = req.body;
    const img = req.file ? req.file.filename : '';

    try {
      const newBook = new Book({
        title,
        author,
        img,
        price,
        description,
        stock,
      });

      await newBook.save();
      res.json({ message: 'Book created' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.status(200).send('Book deleted');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Internal Server Error');
  }
}

const updateBook = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Perbarui data buku
      book.title = req.body.title;
      book.author = req.body.author;
      book.price = req.body.price;
      book.description = req.body.description;
      book.stock = req.body.stock;

      // Perbarui gambar jika ada gambar baru
      if (req.file) {
        book.img = req.file.filename;
      }

      await book.save();
      res.json({ message: 'Book updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const getNewBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(5);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAmountBooks = async (req, res) => {
  try {
    const amount = await Book.countDocuments();
    res.json({count: amount});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getNewBooks, getBooks, postBook, deleteBook, updateBook, getAmountBooks}; 