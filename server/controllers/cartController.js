const Cart = require('../models/cartModel');
const Book = require('../models/bookModel')

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'items.book',
            model: 'Book'
        });
        console.log(cart)

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Add a book to the cart
const addToCart = async (req, res) => {
  const { bookId, quantity, total } = req.body; // Remove user from here
  const userId = req.user._id; // Get user ID from the request

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] }); // Use userId here
    }

    const item = cart.items.find(item => item.book.toString() === bookId);

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ book: bookId, quantity });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

// Remove a book from the cart
const removeFromCart = async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.book.toString() !== bookId);

    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};

// Clear the cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = []; // Kosongkan array items
    await cart.save(); // Simpan perubahan
    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};

const updateCartItemQuantity = async (req, res) => {
  const { userId, bookId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.book.toString() === bookId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Item quantity updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item quantity', error });
  }
};


module.exports = { getCart, addToCart, removeFromCart, clearCart, updateCartItemQuantity };