import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, BookOpen, Calendar, Tag } from "lucide-react";

const CARD_ACCENTS = [
  { tag: "Tutorial",  tagColor: "text-rose-500",   tagBg: "bg-rose-50"   },
  { tag: "Deep Dive", tagColor: "text-blue-500",   tagBg: "bg-blue-50"   },
  { tag: "Opinion",   tagColor: "text-violet-500", tagBg: "bg-violet-50" },
  { tag: "Career",    tagColor: "text-emerald-500",tagBg: "bg-emerald-50"},
  { tag: "Project",   tagColor: "text-amber-500",  tagBg: "bg-amber-50"  },
];

export default function MyBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await fetch(`http://127.0.0.1:8000/api/blog/myblog/${user.id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBlogs(data ? data.data : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setDeletingId(id);
    try {
      await fetch(`http://127.0.0.1:8000/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .mb-font       { font-family: 'DM Sans', sans-serif; }
        .mb-serif      { font-family: 'Lora', serif; }
        .card-lift     { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .fade-in       { animation: fadeUp 0.3s ease forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .skeleton { animation: shimmer 1.4s ease-in-out infinite; background: #e8e6e1; border-radius: 12px; }
        @keyframes shimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>

      <div className="mb-font min-h-screen bg-[#f8f7f4]">

        {/* ── Navbar ── */}
        <nav className="bg-[#1a1a2e] sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>

            <h1 className="mb-serif text-white text-xl font-semibold tracking-tight">
              My Blogs
            </h1>

            <button
              onClick={() => navigate("/create-blog")}
              className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d13a52] text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium"
            >
              <Plus size={14} />
              New Blog
            </button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* ── Page Header ── */}
          <div className="mb-10">
            <span className="inline-block bg-[#1a1a2e] text-[#e94560] text-[0.7rem] font-medium tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4">
              Your Content
            </span>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="mb-serif text-[#1a1a2e] text-4xl font-semibold tracking-tight leading-tight">
                  {loading
                    ? "Loading..."
                    : `${blogs?.length || 0} Blog${blogs?.length !== 1 ? "s" : ""}`}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Manage, edit or delete your posts below.
                </p>
              </div>
            </div>
          </div>

          {/* ── Loading Skeleton ── */}
          {loading && (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-40" />
              ))}
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && blogs?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <BookOpen size={40} className="text-gray-300 mb-4" />
              <p className="mb-serif text-[#1a1a2e] text-xl font-semibold mb-2">
                No blogs yet
              </p>
              <p className="text-gray-400 text-sm mb-5">
                Start writing your first blog post
              </p>
              <button
                onClick={() => navigate("/create-blog")}
                className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d13a52] text-white text-sm px-5 py-2 rounded-lg transition-colors font-medium"
              >
                <Plus size={14} />
                Create First Blog
              </button>
            </div>
          )}

          {/* ── Blog Cards ── */}
          <div className="grid grid-cols-1 gap-5">
            {blogs?.map((blog, idx) => {
              const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
              const initials = (blog.author?.name || "AB").slice(0, 2).toUpperCase();
              return (
                <div
                  key={blog._id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden card-lift fade-in"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">

                      {/* Left — Tag + Title + Meta */}
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-[0.68rem] font-semibold uppercase tracking-widest ${accent.tagColor} mb-2 block`}
                        >
                          {accent.tag}
                        </span>
                        <h2 className="mb-serif text-[#1a1a2e] text-xl font-semibold leading-snug mb-1 truncate">
                          {blog.title}
                        </h2>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-5 h-5 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white text-[0.55rem] font-semibold">
                            {initials}
                          </div>
                          <span className="text-[0.72rem] text-gray-400">
                            {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Excerpt */}
                        {blog.excerpt && (
                          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                            {blog.excerpt}
                          </p>
                        )}

                        {/* Tags */}
                        {blog.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-500 text-[0.7rem] px-3 py-1 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right — Action Buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/edit-blog/${blog._id}`)}
                          className="flex items-center gap-2 text-amber-500 border border-amber-200 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="flex items-center gap-2 text-[#e94560] border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={12} />
                          {deletingId === blog._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}