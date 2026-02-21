const express = require("express")
const mongoose = require("mongoose");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
connectDB()

app.use(express.json())


//ROUTES
app.get("/",(req,res)=>{
    res.send("Hello from the backend")
})



//Starting Server
const PORT = process.env.port || 3000;
app.listen(PORT,"127.0.0.1",(req,res)=>{
    console.log(`Listening to the PORT:${PORT}\nURL: http://127.0.0.1:${PORT}/`)
})