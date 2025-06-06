const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./models/UserModel");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
dotenv.config();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));
app.use(cookieParser());

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
});

// User login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  const isPasswordSame = bcrypt.compareSync(password, user.password);
  try {
    if (isPasswordSame) {
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: '24h' } 
      );
      res.cookie('token', token, {
        // httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //24h
      })
      res.json({
        success: true,
        message: "Login successful",
        data: {username: user.username, id: user._id },
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

// User Profile
app.get('/profile', (req, res)=>{
    const {token} = req.cookies;
    if(!token){
        res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }
    // Verify token
    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) =>{
        if(err) throw err;
        res.json(userInfo)
    })
})

// Logout
app.post('/logout', (req, res) =>{
    res.cookie('token', '').json('ok');

})

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 5000");
});
