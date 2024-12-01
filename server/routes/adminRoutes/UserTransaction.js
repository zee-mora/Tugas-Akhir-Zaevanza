const express = require("express");
const router = express.Router();
const { protect } = require("../../middlewares/authMiddleware"); // Pastikan path ini sesuai

const {
    getUserTransactions,
    postUserTransaction,
    deleteUserTransaction,
    updateUserTransaction,
    getUserTransactionCount,
    sendToEmailUser,
    getTotalrevenue,
    getUserTransactionsById,
    getTotalCount
} = require("../../controllers/userTransactionController");

// Rute ini memerlukan autentikasi
router.get("/transactions", getUserTransactions);
router.get("/transactions/count", getTotalCount);
router.get("/transactions/totalBuyer", getTotalrevenue);
router.post("/transactions", protect, postUserTransaction);
router.delete("/transactions/:id", protect, deleteUserTransaction);
router.put("/transactions/:id", protect, updateUserTransaction);
router.get("/transactions/count", getUserTransactionsById);
router.get("/transactions/count", getUserTransactionCount);
router.get("/transactions/:id", getUserTransactionsById )
router.post("/transactions/send-receipt", protect, sendToEmailUser);
// router.post("/transactions/checkout", protect, createTransaction)

module.exports = router;
