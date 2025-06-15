const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  timeLimit: { type: String, enum: ['monthly', 'weekly', 'yearly'], required: true },
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
