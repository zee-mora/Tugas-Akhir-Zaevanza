const Book = require('../models/bookModel')
const Author = require('../models/authorModel')
const multer = require('multer');
const mongoose = require('mongoose');
const upload = require('../middlewares/upload')

const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('author').populate('category');
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

    const { title, author, price, description, stock, category } = req.body;
    const img = req.file ? req.file.filename : '';

    try {
      const newBook = new Book({
        title,
        author,
        img,
        price,
        description,
        category,
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
      if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Invalid book ID' });
      }
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Perbarui data buku
      book.title = req.body.title;
      book.author = req.body.author;
      book.price = req.body.price;
      book.description = req.body.description;
      book.category = req.body.category
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

const restockBook = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    // Temukan buku berdasarkan ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Perbarui stok buku dengan menambahkan jumlah restock
    book.stock += quantity;

    // Simpan perubahan
    await book.save();
    res.json({ message: 'Book restocked successfully', updatedStock: book.stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restockCheckout = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    // Temukan buku berdasarkan ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Perbarui stok buku dengan menambahkan jumlah restock
    book.stock -= quantity;

    // Simpan perubahan
    await book.save();
    res.json({ message: 'Book restocked successfully', updatedStock: book.stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {getNewBooks, restockCheckout, getBooks, postBook, deleteBook, updateBook, getAmountBooks, restockBook }; 