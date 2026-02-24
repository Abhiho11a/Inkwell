const express = require("express")
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./model/userModel");
const cors = require("cors")
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { blogs } = require("../frontend/src/assets/blogs");


const app = express();
connectDB()

app.use(express.json())
app.use(cors())


//ROUTES
app.get("/",(req,res)=>{
    res.send("Hello from the backend")
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

    console.log("User from DB:", user);
    console.log("Entered password:", password);
    console.log("Stored password:", user?.password);

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
      message: "Login Successful"
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
    const myblog = blogs.filter(blog => blog.author.name === req.params.userId)
    res.status(200).json({ status: "Success", data: myblog })
  } catch (err) {
    res.status(500).json({ status: "Fail", message: "Server Error" })
  }
})


//Starting Server
const PORT = process.env.PORT || 8000;
app.listen(PORT,"127.0.0.1",(req,res)=>{
    console.log(`Listening to the PORT:${PORT}\nURL: http://127.0.0.1:${PORT}/`)
})