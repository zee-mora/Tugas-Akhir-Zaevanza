const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return this.isNew;
        }
    },
    role: {
        type: String,
        default: 'user',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;