const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./models/UserModel");
const app = express();
const bcrypt = require("bcryptjs");
dotenv.config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_CONNECTION);
const salt = bcrypt.genSaltSync(10);

// User registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const user = await UserModel.create({ username, password: hashedPassword });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid request",
      data: error,
    });
  }
  const user = await UserModel.create({ username, password });
  res.json(user);
  res.end();
});

// User login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  const isPasswordSame = bcrypt.compareSync(password, user.password);
  try {
    if (isPasswordSame) {
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username or password",
        data: null,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid request",
      data: error,
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
