const express = require("express");
const router = express.Router();
const Budget = require("../model/Budget");
const authenticateUser = require("../middleware/authMiddleware");  // Token verification middleware

router.post('/', authenticateUser, async (req, res) => {
  console.log("📥 Incoming request body:", req.body); 
  console.log("Authenticated User:", req.user); // Log the user object

  try {
    const { amount, timeLimit } = req.body;
    const userId = req.user.id; // Get from standardized user object

    // Validate input
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Amount must be a valid number' });
    }
    if (!timeLimit) {
      return res.status(400).json({ error: 'Time limit is required' });
    }

    // Find or create budget
    const budget = await Budget.findOneAndUpdate(
      { user: userId },
      { amount: Number(amount), timeLimit },
      { new: true, upsert: true }
    );

    res.status(200).json({ 
      message: budget.isNew ? 'Budget set successfully' : 'Budget updated successfully',
      budget
    });
    
  } catch (err) {
    console.error("Budget error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
  
  module.exports = router;
  
  // 🔥 Fetch budget for the logged-in user
  // budgetRoutes.js
router.get("/", authenticateUser, async (req, res) => {
  try {
    const budget = await Budget.findOne({ user: req.user.id });

    if (!budget) {
      return res.status(200).json({ 
        message: 'No budget set yet', 
        budget: null // Explicitly return null
      });
    }

    res.json({
      message: 'Budget retrieved successfully',
      budget: {
        amount: budget.amount,
        timeLimit: budget.timeLimit
      }
    });
  } catch (error) {
    console.error("Budget fetch error:", error);
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
});

module.exports = router;