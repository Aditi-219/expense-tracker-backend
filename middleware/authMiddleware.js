const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("Received Headers:", req.headers);
  
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log("Decoded Token:", decoded);

    // Standardize the user object
    req.user = {
      id: decoded.userId, // Use userId from token
      userId: decoded.userId, // Use userId from token
      
      ...(decoded.email && { email: decoded.email })
    };

    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;