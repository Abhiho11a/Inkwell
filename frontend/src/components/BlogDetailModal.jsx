import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogDetailModal({ blog, onClose }) {
  const [viewedBlog,setViewedBlog] = useState(blog)
  const [showComments, setShowComments] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [commentText,setCommentText] = useState("")
  const user = JSON.parse(localStorage.getItem("user"))

  if (!blog) return null;

  async function handleAddComment(){
    try {
        // console.log(updatedBlog)
        const response = await fetch(`http://127.0.0.1:8000/api/blogs/${viewedBlog._id}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({text:commentText,author:{name:user.name,_id:user.id}}),
          }
        );

      const data = await response.json();

      if(data.status === "Success")
      {
        alert("Comment posted")
        setCommentText("")
        setShowAddComment(false)
        setViewedBlog(data.updatedBlog)
      }

      // navigate("/myBlog");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      // setUpdating(false);
    }
  };

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
            {viewedBlog.title || "Blog Title Here"}
          </h1>

          {/* Author + Date */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>By {viewedBlog.author.name || "Author Name"}</span>
            <span>•</span>
            <span>
              {viewedBlog.createdAt || "Jan 15, 2026"}
            </span>
          </div>

          {/* Excerpt */}
          <p className="text-gray-600 italic mb-6">
            {viewedBlog.excerpt ||
              "This is a short summary or excerpt of the blog post."}
          </p>

          {/* Blog Content */}
          <div className="text-gray-700 leading-relaxed space-y-4 mb-6">
            <p>
              {viewedBlog.content ||
                "This is the detailed blog content. You can render HTML here if needed or just plain text. Keep it readable and spaced properly."}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(viewedBlog.tags || ["React", "Frontend", "UI"]).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comment Button */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowComments(!showComments)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
            >
              {showComments ? "Hide Comments" : "View Comments"}
            </button>

            <button
              onClick={() => setShowAddComment(!showAddComment)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              {showAddComment ? "Cancel" : "+ Add Comment"}
            </button>
          </div>

          {/* Add Comment Box — shows/hides on button click */}
          {showAddComment && (
            <div className="mt-4 flex gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={()=>handleAddComment()}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm transition"
              >
                Post
              </button>
            </div>
          )}

          {/* Comments Section */}
          {showComments && (
            <div className="mt-6 border-t pt-6 space-y-4">
              {(viewedBlog.comments || [
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