const express = require("express")
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./model/userModel");
const cors = require("cors")
require("dotenv").config();
const bcrypt = require("bcryptjs");
const Blog = require("./model/blogModel");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
connectDB()

app.use(express.json())
app.use(cors())

const rateLimit = require("express-rate-limit");

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute window
  max: 5,                      // max 5 AI requests per minute per user
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "Fail",
    message: "⚠️ Too many AI requests. Please wait a minute and try again."
  }
});
app.use("/api/ai", aiLimiter); 
app.use("/api/ai", aiRoutes);

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
        email:user.email
      }
    });

  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Server Error"
    });
  }
});

//Fetch USER Details by email
app.get("/api/blog/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "Fail",
        message: "ID is required"
      });
    }

    const user = await User.findById( userId );

    res.status(200).json({
      status: "Success",
      message: "Login Successful",
      data:user
    });

  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Server Error"
    });
  }
});
app.put("/api/v1/users/:id", async (req, res) => {
  // console.log(req.body.name)
  // console.log(req.body.email)
  // console.log(req.body.user)
  try {
    // 1. check if logged in user is updating their own profile
    if (req.body.user.id !== req.params.id) {
      return res.status(403).json({
        status: "Fail",
        message: "You can only update your own profile"
      })
    }

    // 2. prevent password update from this route
    if (req.body.password) {
      return res.status(400).json({
        status: "Fail",
        message: "This route is not for password updates"
      })
    }
    // console.log(req.body.name,req.body.email)

    // 3. update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true, runValidators: true }
    ).select("-password") // never send password back

    if (!updatedUser) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found"
      })
    }

    res.status(200).json({
      status: "Success",
      message: "Profile updated successfully",
      user: updatedUser
    })

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message })
  }
})

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
//EDITING Blog
app.put("/api/blogs/:id", async (req, res) => {  // ✅ protect added
  try {
    const blog = await Blog.findById(req.params.id)
    // console.log(blog)  // ✅ typo fixed

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

//DELETING Blog
app.delete("/api/blogs/:id", async (req, res) => {  // ✅ protect added
  try {
    const blog = await Blog.findById(req.params.id)
    // console.log(blog)  // ✅ typo fixed

    const deletedBlog = await Blog.findByIdAndDelete(
      req.params.id
    )

    if (!deletedBlog) {
      return res.status(404).json({
        status: "Fail",
        message: "Blog not found"
      })
    }

    res.status(200).json({
      status: "Success",
      message: "Blog deleted successfully",
    })

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message })  // ✅ err.message
  }
})

//ADDING comments
app.post("/api/blogs/:id/comments", async (req, res) => {  // ✅ protect added
  try {
    const { text,author } = req.body

    if (!text) {
      return res.status(400).json({
        status: "Fail",
        message: "Comment text is required"
      })
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $push: {           // ✅ $push adds to existing array
          comments: {
            author: {
              _id: author._id,
              name: author.name
            },
            text: text,
            createdAt: new Date()
          }
        }
      },
      { new: true }        // returns updated blog
    )

    if (!blog) {
      return res.status(404).json({
        status: "Fail",
        message: "Blog not found"
      })
    }

    res.status(201).json({
      status: "Success",
      message: "Comment added successfully",
      updatedBlog: blog   // send back updated comments array
    })

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message })
  }
})

// ── 1. TRACK VIEW (call this when a blog is opened)
// POST /api/blogs/:id/view
app.post("/api/blogs/:id/view", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ status: "Fail", message: "Blog not found" });

    // only count if this IP hasn't viewed before
    if (!blog.viewedBy.includes(ip)) {
      blog.views += 1;
      blog.viewedBy.push(ip);
      await blog.save();
    }

    res.status(200).json({ status: "Success", views: blog.views });
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});

// GET /api/analytics/:userId
app.get("/api/analytics/:userId", async (req, res) => {
  try {
    const blogs = await Blog.find({ "author._id": req.params.userId });

    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
    const totalLikes = blogs.reduce((sum, b) => sum + (b.likes || 0), 0);
    const totalComments = blogs.reduce((sum, b) => sum + (b.comments?.length || 0), 0);

    const blogStats = blogs.map(b => ({
      _id: b._id,
      title: b.title,
      views: b.views || 0,
      likes: b.likes || 0,
      comments: b.comments?.length || 0,
      tags: b.tags,
      createdAt: b.createdAt,
      readTime: Math.ceil(b.content?.split(" ").length / 200) || 1
    }));

    // sort by views descending
    blogStats.sort((a, b) => b.views - a.views);

    res.status(200).json({
      status: "Success",
      data: {
        totalViews,
        totalLikes,
        totalComments,
        totalBlogs: blogs.length,
        topBlog: blogStats[0] || null,
        blogs: blogStats
      }
    });
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});
// Track a view (call when blog is opened)
app.post("/api/blogs/:id/view", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ status: "Fail", message: "Not found" });
    if (!blog.viewedBy.includes(ip)) {
      blog.views += 1;
      blog.viewedBy.push(ip);
      await blog.save();
    }
    res.status(200).json({ status: "Success", views: blog.views });
  } catch (err) { res.status(500).json({ status: "Fail", message: err.message }); }
});

// Get analytics for a user
app.get("/api/analytics/:userId", async (req, res) => {
  try {
    const blogs = await Blog.find({ "author._id": req.params.userId });
    const blogStats = blogs.map(b => ({
      _id: b._id, title: b.title,
      views: b.views || 0, likes: b.likes || 0,
      comments: b.comments?.length || 0, tags: b.tags,
      createdAt: b.createdAt,
      readTime: Math.ceil(b.content?.split(" ").length / 200) || 1
    })).sort((a, b) => b.views - a.views);
    res.status(200).json({ status: "Success", data: {
      totalViews: blogStats.reduce((s, b) => s + b.views, 0),
      totalLikes: blogStats.reduce((s, b) => s + b.likes, 0),
      totalComments: blogStats.reduce((s, b) => s + b.comments, 0),
      totalBlogs: blogs.length, topBlog: blogStats[0] || null, blogs: blogStats
    }});
  } catch (err) { res.status(500).json({ status: "Fail", message: err.message }); }
});

// POST /api/blogs/:id/like
app.post("/api/blogs/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ status: "Fail", message: "userId required" });
 
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ status: "Fail", message: "Blog not found" });
 
    const alreadyLiked = blog.likedBy.includes(userId);
 
    if (alreadyLiked) {
      // unlike
      blog.likedBy = blog.likedBy.filter(id => id !== userId);
      blog.likes   = Math.max(0, blog.likes - 1);
    } else {
      // like
      blog.likedBy.push(userId);
      blog.likes += 1;
    }
 
    await blog.save();
 
    res.status(200).json({
      status:  "Success",
      liked:   !alreadyLiked,
      likes:   blog.likes
    });
 
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});
 
// POST /api/blogs/:id/bookmark
app.post("/api/blogs/:id/bookmark", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ status: "Fail", message: "userId required" });
 
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ status: "Fail", message: "Blog not found" });
 
    const alreadyBookmarked = blog.bookmarkedBy.includes(userId);
 
    if (alreadyBookmarked) {
      blog.bookmarkedBy = blog.bookmarkedBy.filter(id => id !== userId);
    } else {
      blog.bookmarkedBy.push(userId);
    }
 
    await blog.save();
 
    res.status(200).json({
      status:     "Success",
      bookmarked: !alreadyBookmarked,
    });
 
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});
 
// GET /api/users/:userId/bookmarks
app.get("/api/users/:userId/bookmarks", async (req, res) => {
  try {
    const blogs = await Blog.find({ bookmarkedBy: req.params.userId })
      .sort({ createdAt: -1 });
 
    res.status(200).json({ status: "Success", data: blogs });
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});

//Starting Server
const PORT = process.env.PORT || 8000;
app.listen(PORT,"0.0.0.0",(req,res)=>{
    console.log(`Listening to the PORT:${PORT}\nURL: http://127.0.0.1:${PORT}/`)
})