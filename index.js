require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");

const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const budgetRoutes=require("./routes/budgetRoutes");

const PORT = process.env.PORT || 3010;
const uri = process.env.MONGO_URL;

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL ,
  credentials: true
};
app.use(cors(corsOptions));

app.use(cors({
  origin: process.env.FRONTEND_URL , 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/budget",budgetRoutes);

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
