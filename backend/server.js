const express = require("express")
require("dotenv").config();

const app = express();


//ROUTES
app.get("/",(req,res)=>{
    res.send("Hello from the backend")
})



//Starting Server
const PORT = process.env.port || 3000;
app.listen(PORT,"127.0.0.1",(req,res)=>{
    console.log(`Listening to the PORT:${PORT}\nURL: http://127.0.0.1:${PORT}/`)
})