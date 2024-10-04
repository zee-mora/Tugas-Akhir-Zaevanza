const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    // Periksa apakah ada header authorization dan token diawali dengan Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari header
            token = req.headers.authorization.split(' ')[1];
            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded); 
            // Temukan pengguna berdasarkan ID yang terkode dalam token
            req.user = await User.findById(decoded.id).select('-password');
            
            // Jika pengguna tidak ditemukan, kirim respons tidak terautorisasi
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Pindahkan next() ke sini, setelah memverifikasi pengguna
        } catch (error) {
            console.error('Not authorized, token failed', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // Jika tidak ada token, kirim respons tidak terautorisasi
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
