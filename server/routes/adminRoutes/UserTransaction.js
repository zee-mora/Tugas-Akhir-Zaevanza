const express = require("express");
const router = express.Router();
const { protect } = require("../../middlewares/authMiddleware"); // Pastikan path ini sesuai

const {
    getUserTransactions,
    postUserTransaction,
    deleteUserTransaction,
    updateUserTransaction,
    getUserTransactionCount,
} = require("../../controllers/userTransactionController");

// Rute ini memerlukan autentikasi
router.get("/transactions", getUserTransactions);
router.post("/transactions", protect, postUserTransaction);
router.delete("/transactions/:id", protect, deleteUserTransaction);
router.put("/transactions/:id", protect, updateUserTransaction);
router.get("/transactions/count", getUserTransactionCount);

module.exports = router;
