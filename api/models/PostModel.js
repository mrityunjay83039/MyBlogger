const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    summary: String,
    cover: String, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
