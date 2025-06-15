const mongoose = require("mongoose");
const express = require("express");
const Transaction = require("../model/Transaction");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, type } = req.body;
    const userId = req.user.userId;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const newTransaction = new Transaction({
      userId,
      title,
      amount,
      type,
      category,
    });
    await newTransaction.save();
    res
      .status(201)
      .json({ message: "Transaction added!", transaction: newTransaction });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res
      .status(500)
      .json({ error: "Error adding transaction", details: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const transactions = await Transaction.find({ userId });

    console.log("Fetched Transactions:", transactions);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Transaction Fetch Error:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findOneAndDelete({_id: id, userId,});

    if (!transaction) { return res.status(404).json({ error: "Transaction not found" });}

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Delete Error:", error.message);
    res.status(500).json({ error: "Error deleting transaction", details: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, type } = req.body;
    const transactionId = req.params.id;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      { title, amount, category, type },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    res.status(500).json({ error: "Error updating transaction", details: error.message });
  }
});

module.exports = router;
