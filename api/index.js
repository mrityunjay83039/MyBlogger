const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
dotenv.config();

//models
const UserModel = require("./models/UserModel");
const PostModel = require("./models/PostModel");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

const uploadMiddleWare = multer({ dest: "uploads/" });

mongoose
  .connect(process.env.DB_CONNECTION)
  .then((res) => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });
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
        { expiresIn: "24h" }
      );
      res.cookie("token", token, {
        // httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //24h
      });
      res.json({
        success: true,
        message: "Login successful",
        data: { username: user.username, id: user._id },
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
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
  // Verify token
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) throw err;
    res.json(userInfo);
  });
});

// Logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// Create Post
app.post("/post", uploadMiddleWare.single("files"), (req, res) => {
  let newFilePath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const partdata = originalname.split(".");
    const extension = partdata[partdata.length - 1];
    newFilePath = path + "." + extension;
    newFilePath = newFilePath.replace(/\\/g, "/");
    fs.renameSync(path, newFilePath);
  }

  const { token } = req.cookies;

  jwt.verify(token, process.env.SECRET_KEY, {}, async (err, data) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const PostDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: newFilePath,
      author: data.id,
    });
    res.json({
      success: true,
      message: "Post created successfully",
      data: PostDoc,
    });
  });
});

// Update Posts
app.put("/post", uploadMiddleWare.single("file"), async (req, res) => {
  const { token } = req.cookies;
  let newFilePath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const partdata = originalname.split(".");
    const extension = partdata[partdata.length - 1];
    newFilePath = path + "." + extension;
    newFilePath = newFilePath.replace(/\\/g, "/");
    fs.renameSync(path, newFilePath);
  }

  jwt.verify(token, process.env.SECRET_KEY, {}, async (err, data) => {
    if (err) throw err;
    const { title, summary, content, id } = req.body;
    const PostData = await PostModel.findById(id);
    const isAuthor =
      JSON.stringify(PostData.author) === JSON.stringify(data.id);
    if (!isAuthor) {
      return res.status(400).json({
        success: false,
        message: "You are not the author of this post!",
      });
    }
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        content,
        cover: newFilePath || PostData.cover,
      },
      { new: true } // Returns the updated document
    );

    res.json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  });
});

// get all posts

app.get("/all-posts", async (req, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json({
    success: true,
    data: posts,
  });
});

// get single post by id
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await PostModel.findById(id);
  res.json({
    success: true,
    data: post,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 5000");
});
