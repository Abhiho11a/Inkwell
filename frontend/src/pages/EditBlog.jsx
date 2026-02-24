import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
  });

  const [existingBlog, setExistingBlog] = useState(null);

  // 🔹 Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/blogs/${id}`
        );
        const result = await res.json();
        const data = result.blog

        setExistingBlog(data);
        console.log(data)

        setFormData({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          tags: data.tags?.join(", "),
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const updatedBlog = {
      ...existingBlog,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };

    try {
        console.log(updatedBlog)
      const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBlog),
        }
      );

      const data = await response.json();
      console.log(data)

      navigate("/myBlog");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading blog...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-md">

        {/* Header */}
        <div className="relative flex items-center justify-center mb-8 h-10">

          <button
            onClick={() => navigate("/myblog")}
            className="absolute left-0 text-gray-600 hover:text-black transition"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Edit Blog
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
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium"
          >
            {updating ? "Updating..." : "Update Blog"}
          </button>

        </form>
      </div>
    </div>
  );
}