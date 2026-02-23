import React, { useState } from "react";

export default function BlogDetailModal({ blog, onClose }) {
  const [showComments, setShowComments] = useState(false);

  if (!blog) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">

        {/* Modal Container */}
        <div className="relative bg-white w-[90%] md:w-1/2 max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-8 z-50">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-500 hover:text-black text-2xl transition"
          >
            ✕
          </button>

          {/* Blog Title */}
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {blog.title || "Blog Title Here"}
          </h1>

          {/* Author + Date */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>By {blog.author.name || "Author Name"}</span>
            <span>•</span>
            <span>
              {blog.createdAt || "Jan 15, 2026"}
            </span>
          </div>

          {/* Excerpt */}
          <p className="text-gray-600 italic mb-6">
            {blog.excerpt ||
              "This is a short summary or excerpt of the blog post."}
          </p>

          {/* Blog Content */}
          <div className="text-gray-700 leading-relaxed space-y-4 mb-6">
            <p>
              {blog.content ||
                "This is the detailed blog content. You can render HTML here if needed or just plain text. Keep it readable and spaced properly."}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(blog.tags || ["React", "Frontend", "UI"]).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            {showComments ? "Hide Comments" : "View Comments"}
          </button>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-6 border-t pt-6 space-y-4">
              {(blog.comments || [
                { id: 1, user: "John", text: "Great article!" },
                { id: 2, user: "Sara", text: "Really helpful explanation." },
              ]).map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <p className="font-semibold text-sm text-gray-800">
                    {comment.user}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}