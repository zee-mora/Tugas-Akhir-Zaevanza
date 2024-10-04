const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart, updateCartItemQuantity } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/cart/:userId', protect, getCart); 
router.post('/cart', protect, addToCart); 
router.delete('/cart/:userId', protect, clearCart);  
router.delete('/cart/:userId/:bookId', protect, removeFromCart);
router.put('/cart/:userId/:bookId', protect, updateCartItemQuantity); 

module.exports = router;