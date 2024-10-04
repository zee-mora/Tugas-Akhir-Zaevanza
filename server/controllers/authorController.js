const mongoose = require('mongoose');
const Author = require('../models/authorModel');

const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postAuthor = async (req, res) => {
  const { name, age } = req.body;
  if (age < 0) {
    return res.status(400).json({ message: 'Age cannot be negative' });
  }
  try {
    const existingAuthor = await Author.findOne({ name });
    if (existingAuthor) {
      return res.status(400).json({ message: 'Author with this name already exists' });
    }
    const newAuthor = new Author({ name, age });
    await newAuthor.save();
    res.status(201).json({ message: 'Author created successfully', author: newAuthor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    // Validasi ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }

    // Cari penulis berdasarkan ID
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Hapus penulis
    await Author.deleteOne({ _id: req.params.id });
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    // Validasi ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }

    // Cari dan perbarui penulis berdasarkan ID
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json({ message: 'Author updated successfully', author });
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAuthors, postAuthor, deleteAuthor, updateAuthor };