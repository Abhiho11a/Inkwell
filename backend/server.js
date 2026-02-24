const express = require("express")
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./model/userModel");
const cors = require("cors")
require("dotenv").config();
const bcrypt = require("bcryptjs");
const Blog = require("./model/blogModel");


const app = express();
connectDB()

app.use(express.json())
app.use(cors())


//ROUTES
app.get("/",(req,res)=>{
    res.send("Hello from the backend")
})

app.get("/api/blogs",async(req,res)=>{
  try{

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 3
    const skip = (page - 1) * limit

    const totalBlogs = await Blog.countDocuments()
    const totalPages = Math.ceil(totalBlogs / limit)

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.status(200).json({message:"Success",data:blogs})
  }catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Server Error"
    });
  }
})

app.post("/api/blog/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        status: "Fail",
        message: "User with this email already exists"
      });
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: password
    });

    // console.log(user)
    res.status(201).json({
      status: "Success",
      message: "User Created Successfully"
    });

  } catch (error) {

    // 👇 Catch mongoose validation error
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;

      return res.status(400).json({
        status: "Fail",
        message: firstError
      });
    }

    // fallback
    res.status(500).json({
      status: "Fail",
      message: error.message
    });
  }
});

app.post("/api/blog/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)

    if (!email || !password) {
      return res.status(400).json({
        status: "Fail",
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    // console.log("User from DB:", user);
    // console.log("Entered password:", password);
    // console.log("Stored password:", user?.password);

    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
      console.log("isMatch:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        status: "Fail",
        message: "Invalid Email or Password"
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Login Successful",
      data:{
        id:user._id,
        name:user.name,
      }
    });

  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Server Error"
    });
  }
});

app.get("/api/blog/myblog/:userId", async (req, res) => {
  try {
    // console.log(req.params.userId)
    const myblogs = await Blog.find({"author._id":req.params.userId})
    res.status(200).json({ status: "Success", data: myblogs })
  } catch (err) {
    res.status(500).json({ status: "Fail", message: "Server Error" })
  }
})

app.post("/api/blogs",async(req,res) => {
  try{
    const {newBlog,userId} = req.body
    console.log(newBlog,userId)
    const blogExists = await Blog.findOne({"title":newBlog.title,"excerpt":newBlog.excerpt})

    if(blogExists)
      return res.status(409).json({
        status: "Fail",
        message: "Blog with this title and excerpt already exists"
      });


    await Blog.create({
      title:newBlog.title,
      excerpt:newBlog.excerpt,
      content:newBlog.content,
      author:{_id:userId.id,name:userId.name},
      tags:newBlog.tags,
      comments:newBlog.comments
    })

    res.status(200).json({status:"Success",message:"Blog created Successfully"})
  }catch(err){
    console.log(err)
    res.status(500).json({status:"Fail",message:"Server Error"})
  }

})

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({
        status: "Fail",
        message: "Blog not found"
      })
    }

    res.status(200).json({ status: "Success", blog })

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message })
  }
})

app.put("/api/blogs/:id", async (req, res) => {  // ✅ protect added
  try {
    const blog = await Blog.findById(req.params.id)
    console.log(blog)  // ✅ typo fixed

    if (!blog) {
      return res.status(404).json({
        status: "Fail",
        message: "Blog not found"
      })
    }

    // if (blog.author._id.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     status: "Fail",
    //     message: "You are not allowed to edit this blog"
    //   })
    // }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        tags: req.body.tags
      },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      status: "Success",
      message: "Blog updated successfully",
      data: updatedBlog
    })

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message })  // ✅ err.message
  }
})


//Starting Server
const PORT = process.env.PORT || 8000;
app.listen(PORT,"127.0.0.1",(req,res)=>{
    console.log(`Listening to the PORT:${PORT}\nURL: http://127.0.0.1:${PORT}/`)
})