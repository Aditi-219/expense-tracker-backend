const express = require("express");
const router = express.Router();
const User = require("../model/User");  // Adjust the path if needed
const authenticateToken = require("../middleware/authMiddleware");  // Middleware to verify token

// ✅ Get User Profile (GET)
router.get("/profile", authenticateToken, async (req, res) => {
    console.log("Extracted User ID from Token:", req.user.userId); 
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update User Profile (PUT) ➡️ Add this route
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const { name, email, phone } = req.body;  // Extract updated fields

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email, phone },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
