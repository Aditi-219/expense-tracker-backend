const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const router = express.Router();
const JWT_SECRET = process.env.TOKEN_KEY;

// ✅ Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // 🔹 Validate input fields
        if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });

        // 🔹 Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // 🔹 Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 🔹 Save user to DB
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Invalid Password" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

        // ✅ Send user details along with token
        res.cookie("token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict" 
        }).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Logout Route
router.post("/logout", (req, res) => {
    res.clearCookie("token", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict" 
    });

    res.json({ message: "Logged out successfully" });
});

module.exports = router;
