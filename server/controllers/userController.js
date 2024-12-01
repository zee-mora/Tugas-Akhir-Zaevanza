const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const postUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        //validasi
        if (!newUser.username || !newUser.email || !newUser.password) {
            return res.status(400).json({ message: 'All input is required' });
        }

        const existingUser = await User.findOne({ email : newUser.email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        await newUser.save();
        res.json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const DeleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getUsers, postUser, getUserById, DeleteUserById };