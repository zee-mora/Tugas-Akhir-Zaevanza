const express = require('express');
const router = express.Router();
const User = require('../../models/userModel');

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

//edit user
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        await user.save();
        res.json({ message: 'User updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

//delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.remove();
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

//get total user
router.get('/users/count', async (req, res) => {
    try {
        const total = await User.countDocuments();
        res.json({count: total});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

module.exports = router;