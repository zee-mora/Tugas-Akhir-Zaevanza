const express = require('express');
const { getCategories, postCategory, deleteCategory, updateCategory} = require('../../controllers/categoryController');
const router = express.Router();

router.get('/categories/', getCategories);
router.post('/categories/', postCategory);
router.delete('/categories/:id', deleteCategory);
router.put('/categories/:id', updateCategory);

module.exports = router;