const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password by default
    }
},
  {timestamps:true}
)

const User = mongoose.model("User", userSchema);
module.exports = User;