const express = require("express")
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./model/userModel");
const cors = require("cors")
require("dotenv").config();
const bcrypt = require("bcryptjs")


const app = express();
connectDB()

app.use(express.json())
app.use(cors())


//ROUTES
app.get("/",(req,res)=>{
    res.send("Hello from the backend")
})

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        status: "Fail",
        message: "User with this email already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword
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

//Starting Server
const PORT = process.env.port || 8000;
app.listen(PORT,"127.0.0.1",(req,res)=>{
    console.log(`Listening to the PORT:${PORT}\nURL: http://127.0.0.1:${PORT}/`)
})