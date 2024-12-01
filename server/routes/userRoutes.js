const express = require('express');
const Category = require('../models/categoryModel');
const { getUsers, postUser, getUserById, DeleteUserById } = require('../controllers/userController');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById );
router.post('/users', postUser);
router.delete('/users/:id', DeleteUserById);

// Mengambil kategori berdasarkan ID
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;