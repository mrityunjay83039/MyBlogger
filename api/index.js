const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./models/UserModel");
const app = express();
const bcrypt = require('bcryptjs');
dotenv.config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_CONNECTION);
const salt = bcrypt.genSaltSync(10);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  try {
    const user = await UserModel.create({ username, password:hashedPassword });
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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
