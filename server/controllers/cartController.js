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
// Add a book to the cart with stock validation
const addToCart = async (req, res) => {
  const { bookId, quantity } = req.body; // Dapatkan ID buku dan jumlah dari request body
  const userId = req.user._id; // Dapatkan user ID dari request

  try {
    // Cari buku berdasarkan ID untuk memeriksa stoknya
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Validasi stok buku
    if (book.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Cari keranjang pengguna atau buat keranjang baru jika belum ada
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Periksa apakah buku sudah ada di keranjang
    const item = cart.items.find(item => item.book.toString() === bookId);

    if (item) {
      // Jika item sudah ada di keranjang, tambahkan kuantitasnya
      const newQuantity = item.quantity + quantity;
      if (newQuantity > book.stock) {
        return res.status(400).json({ message: 'Not enough stock for the requested quantity' });
      }
      item.quantity = newQuantity;
    } else {
      // Jika item belum ada di keranjang, tambahkan item baru
      cart.items.push({ book: bookId, quantity });
    }
    
    await book.save();
    await cart.save();

    res.status(201).json({ message: 'Book added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

// Remove a book from the cart and restore stock
const removeFromCart = async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    // Cari keranjang pengguna berdasarkan ID
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Cari item di keranjang berdasarkan ID buku
    const item = cart.items.find(item => item.book.toString() === bookId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Cari buku untuk mengembalikan stok
    const book = await Book.findById(bookId);
    if (book) {
      // Tambahkan kembali kuantitas item yang dihapus ke stok buku
      book.stock += item.quantity;
      await book.save();
    }

    // Hapus item dari keranjang
    cart.items = cart.items.filter(item => item.book.toString() !== bookId);
    await cart.save();

    res.status(200).json({ message: 'Item removed from', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
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

const restockBook = async (req, res) => {
  const { bookId, quantity } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.stock += quantity;
    await book.save();

    res.status(200).json({ message: 'Book restocked', book });
  } catch (error){
    console.error('error restocking book:', error);
    res.status(500).json({ message: 'Error restocking book', error });
  }
}

module.exports = { restockBook, getCart, addToCart, removeFromCart, clearCart, updateCartItemQuantity };