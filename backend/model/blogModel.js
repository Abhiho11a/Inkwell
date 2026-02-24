// models/blogModel.js
const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  author: {
    name: { type: String, required: true },
    _id: { type: String, required: true }
  },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
})

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: 100
  },
  excerpt: {
    type: String,
    required: [true, "Excerpt is required"],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  author: {
    name: { type: String, required: true },
    _id: { type: String, required: true }
  },
  tags: [{ type: String, trim: true }],
  comments: [commentSchema]
}, { timestamps: true })

const Blog = mongoose.model("Blog", blogSchema)
module.exports = Blog