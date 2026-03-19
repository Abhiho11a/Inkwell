import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = JSON.parse(localStorage.getItem("user"));

    const newBlog = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: { name: user?.name, _id: user?._id },
      createdAt: new Date().toISOString(),
      tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      comments: [],
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newBlog, userId }),
      });
      const data = await response.json();
      if (data.status === "Success") {
        alert(data.message);
        navigate("/myblog");
      } else if (data.status === "Fail") {
        alert(data.message);
      }
    } catch (error) {
      console.error("Blog creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .cb-font  { font-family: 'DM Sans', sans-serif; }
        .cb-serif { font-family: 'Lora', serif; }

        .cb-input {
          width: 100%;
          background: #f8f7f4;
          border: 1.5px solid #e5e3de;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: none;
        }
        .cb-input::placeholder { color: #aaa; }
        .cb-input:focus {
          border-color: #e94560;
          box-shadow: 0 0 0 3px rgba(233,69,96,0.08);
          background: #fff;
        }

        .cb-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #6b7280;
          letter-spacing: 0.4px;
          margin-bottom: 7px;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="cb-font min-h-screen bg-[#f8f7f4]">

        {/* ── Navbar ── */}
        <nav className="bg-[#1a1a2e] sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-6 h-[60px] flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <h1 className="cb-serif text-white text-xl font-semibold tracking-tight">
              Create Blog
            </h1>
            <div className="w-16" />
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">

          {/* ── Page Header ── */}
          <div className="mb-8">
            <span className="inline-block bg-[#1a1a2e] text-[#e94560] text-[0.7rem] font-medium tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4">
              New Post
            </span>
            <h2 className="cb-serif text-[#1a1a2e] text-4xl font-semibold tracking-tight leading-tight">
              Write Something<br />
              <em className="not-italic text-[#e94560]">Amazing</em>
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Fill in the details below and hit publish when you're ready.
            </p>
          </div>

          {/* ── Form Card ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div>
                <label className="cb-label">Blog Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a catchy title..."
                  className="cb-input"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="cb-label">Excerpt</label>
                <textarea
                  name="excerpt"
                  required
                  rows="3"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Short summary of your blog..."
                  className="cb-input"
                />
              </div>

              {/* Content */}
              <div>
                <label className="cb-label">Content</label>
                <textarea
                  name="content"
                  required
                  rows="9"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your full blog content here..."
                  className="cb-input"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="cb-label">Tags <span className="text-gray-300">(comma separated)</span></label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="React, JavaScript, MongoDB"
                  className="cb-input"
                />
                {/* Tag preview */}
                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.split(",").map((t, i) =>
                      t.trim() ? (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-500 text-[0.7rem] px-3 py-1 rounded-full"
                        >
                          #{t.trim()}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Author + Submit Row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white text-xs font-semibold">
                    {(user?.name || "AB").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1a1a2e]">{user?.name}</p>
                    <p className="text-[0.7rem] text-gray-400">Author</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d13a52] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <Send size={14} />
                  {loading ? "Publishing..." : "Publish Blog"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}