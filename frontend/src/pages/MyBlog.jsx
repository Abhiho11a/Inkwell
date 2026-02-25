import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"

export default function MyBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔹 Fetch User Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")) // ✅ get logged in user
        // console.log(user)

        const res = await fetch(`http://127.0.0.1:8000/api/blog/myblog/${user.id}`, { // ✅ dynamic
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        // console.log(data)
        setBlogs(data ? data.data : null);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  // 🔹 Delete Blog
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // 🔹 Edit Blog
  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
            <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-black transition"
            >
                ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              My Blogs
            </h1>

          <button
            onClick={() => navigate("/create-blog")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            + Create New Blog
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-500">
            Loading your blogs...
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs?.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">You haven't written any blogs yet.</p>
          </div>
        )}

        {/* Blog Cards */}
        <div className="space-y-8">
          {blogs?.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              {/* Title */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h2>

              {/* Date */}
              <p className="text-sm text-gray-400 mb-4">
                {new Date(blog.createdAt).toDateString()}
              </p>

              {/* Excerpt */}
              <p className="text-gray-600 mb-6">
                {blog.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(blog._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}