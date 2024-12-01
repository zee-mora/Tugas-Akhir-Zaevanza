const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const User = require('./routes/adminRoutes/Users')
const UserTransaction = require('./routes/adminRoutes/UserTransaction')
const Author = require('./routes/adminRoutes/uploadAuthor')
const Book = require('./routes/adminRoutes/uploadBook')
const Category = require('./routes/adminRoutes/uploadCategory')
const Cart = require('./routes/cartRoute')
const path = require('path');
const feedbackRoutes = require('./routes/feedbackRoutes');
require('dotenv').config();
// const debug = require('./routes/debugging/cartDebug');

const app = express();

app.use(cors());
app.use(express.json());

// app.use('/api', debug);
app.use('/api', Cart);
app.use('/api', Category);
app.use('/api', Book);
app.use('/api', Author);
app.use('/api', User);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', UserTransaction);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads/profile')));

app.get('/', (req, res) => {
    res.send('welcome to API');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
