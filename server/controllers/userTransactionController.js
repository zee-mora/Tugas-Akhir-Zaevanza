const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
// const midtransClient = require('midtrans-client')

const getUserTransactionsById = async (req, res) => {
    try {
        const userId = req.params.id;
        const transactions = await Transaction.find({ userId }).populate('items.bookId', 'title author price');
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all transactions (Admin or specific user)
const getUserTransactions = async (req, res) => {
    try {
        const userId = req.user?.id; // Mengambil userId dari req.user
        const isAdmin = req.user?.role === 'admin'; // Pastikan role admin sudah ada di req.user

        let transactions;
        if (isAdmin) {
            // Jika admin, ambil semua transaksi
            transactions = await Transaction.find()
            .populate('user', 'name email')
            .populate('items.bookId', 'title author price');
        // } else if (!userId) {
        //     return res.status(401).json({ message: 'User not authenticated' });
        } else {
            // Jika bukan admin, ambil transaksi untuk pengguna tertentu
            transactions = await Transaction.find({ user: userId });
        }

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Post a new transaction for a user
const postUserTransaction = async (req, res) => {
    try {
        console.log('Request body:', req.body);  // Log data yang diterima
        
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { total, description, items } = req.body;
        if (!total || !description || !items) {
            return res.status(400).json({ message: 'Total, description, and items are required' });
        }

        const newTransaction = new Transaction({
            userId,  // Sesuaikan dengan field di model
            total,
            description,
            items,
        });

        await newTransaction.save();
        res.status(201).json({ message: 'Transaction created successfully' });
    } catch (error) {
        console.error('Error creating transaction:', error);  // Log error
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Delete a user transaction
const deleteUserTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.deleteOne();
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error.message);
        res.status(500).json({ message: 'Internal server error' });
        
    }
};

// Update a user transaction
const updateUserTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const { amount, description } = req.body;
        if (!amount || !description) {
            return res.status(400).json({ message: 'Amount and description are required' });
        }

        transaction.amount = amount;
        transaction.description = description;
        await transaction.save();

        res.json({ message: 'Transaction updated successfully' });
    } catch (error) {
        console.error('Error updating transaction:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//get total transaction
const getUserTransactionCount = async (req, res) => {
    try {
        const total = await Transaction.countDocuments();
        res.json({count: total});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const sendToEmailUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getTotalrevenue = async (req, res) => {
    try {
        const total = await Transaction.aggregate({
            $group: {
                _id: null,
                total: { $sum: '$totalAmount' }
            }
        })
       
        res.status(200).json({ total: total[0]?.total || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const getTransactionByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const transactions = await Transaction.find({ userId });
        userId.populate('items.bookId', 'title author price');
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const getTotalCount = async (req, res) => {
    try {
        const total = await Transaction.countDocuments();
        res.json({ count: total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


module.exports = {
    getTotalCount,
    getTransactionByUserId,
    getUserTransactions,
    postUserTransaction,
    deleteUserTransaction,
    updateUserTransaction,
    getUserTransactionCount,
    sendToEmailUser,
    getTotalrevenue,
    getUserTransactionsById
};
