const Contact = require('../models/contactModel');

const contactAdmin = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All input is required' });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.json({ message: 'Contact created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMessage = async (req, res) => {
    try {
        const messages = await Contact.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).send('Message not found');
        }
        res.status(200).send('Message deleted');
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { contactAdmin, getMessage, deleteMessage };                                                         