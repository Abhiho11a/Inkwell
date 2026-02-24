import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit Blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = JSON.parse(localStorage.getItem("user"))

    const newBlog = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: {
        name: user?.name,
        _id: user?._id,
      },
      createdAt: new Date().toISOString(),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      comments: [], // 🔹 Initially empty
    };
    
    try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({newBlog,userId})
        });

        const data = await response.json()
        // console.log(data)

        if(data.status === "Success")
        {
          alert(data.message)
          navigate("/myblog");
        }
        else if(data.status === "Fail")
          alert(data.message)
        
    } catch (error) {
      console.error("Blog creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-md">

        {/* Header */}
        {/* Back Button */}
        <div className="relative flex items-center justify-center mb-8 h-10">
            <button
                onClick={() => navigate(-1)}
                className="absolute left-0 text-gray-600 hover:text-black transition"
            >
                ← Back
            </button>

            <h1 className="text-3xl font-bold text-gray-800">
                Create New Blog
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              required
              rows="3"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Short summary of your blog"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              name="content"
              required
              rows="8"
              value={formData.content}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your full blog content here..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, JavaScript, MongoDB"
            />
          </div>

          {/* Author Info (Read Only) */}
          <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
            Author: <span className="font-medium">{user?.name}</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>

        </form>
      </div>
    </div>
  );
}