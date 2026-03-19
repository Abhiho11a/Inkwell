import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Eye, Trash2 } from "lucide-react";
import BlogDetailModal from "../components/BlogDetailModal";

const API = import.meta.env.VITE_API_URL;

const TAG_MAP = {
  Tech:     { color:"#3b82f6", light:"#eff6ff" },
  Design:   { color:"#ec4899", light:"#fdf2f8" },
  Career:   { color:"#10b981", light:"#ecfdf5" },
  Tutorial: { color:"#f59e0b", light:"#fffbeb" },
  Startup:  { color:"#f97316", light:"#fff7ed" },
  Life:     { color:"#8b5cf6", light:"#f5f3ff" },
  General:  { color:"#94a3b8", light:"#f8fafc" },
};

const TAG_KW = {
  Tech:["react","javascript","js","node","python","typescript","nextjs","express","mongodb","sql","api","backend","frontend","fullstack","web","coding","programming","developer","software","github","git","docker","aws","cloud","ai","ml"],
  Design:["ui","ux","design","figma","css","tailwind","animation","typography","graphic"],
  Career:["job","career","resume","interview","placement","linkedin","internship","hiring","portfolio"],
  Tutorial:["tutorial","learn","course","study","beginner","guide","tips","roadmap"],
  Startup:["startup","product","saas","business","entrepreneur","mvp","founder"],
  Life:["life","mindset","motivation","productivity","personal","growth","story","opinion"],
};

function getCat(tags) {
  if (!tags?.length) return "General";
  const norm = tags.flatMap(t => t.toLowerCase().trim().split(/\s+/));
  for (const [name, kws] of Object.entries(TAG_KW)) {
    if (kws.some(k => norm.includes(k))) return name;
  }
  return "General";
}

const readTime = c => Math.ceil((c?.split(" ").length || 0) / 200) || 1;

export default function SavedBlogs() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user"));
  const userId    = user?._id || user?.id;

  const [blogs,       setBlogs]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [detailBlog,  setDetailBlog]  = useState(null);
  const [removing,    setRemoving]    = useState(null); // id of blog being un-bookmarked

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchSaved();
  }, []);

  async function fetchSaved() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/users/${userId}/bookmarks`);
      const data = await res.json();
      if (data.status === "Success") setBlogs(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleRemove(blogId) {
    setRemoving(blogId);
    try {
      const res  = await fetch(`${API}/api/blogs/${blogId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.status === "Success") {
        setBlogs(prev => prev.filter(b => b._id !== blogId));
      }
    } catch (err) { console.error(err); }
    finally { setRemoving(null); }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .sb-font  { font-family:'DM Sans',sans-serif; }
        .sb-serif { font-family:'Lora',serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.35s ease both; }
      `}</style>

      <div className="sb-font min-h-screen bg-[#f8f7f4]">

        {/* Navbar */}
        <nav className="bg-[#1a1a2e] sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition">
              <ArrowLeft size={15}/> Back
            </button>
            <h1 className="sb-serif text-white text-lg font-semibold">Saved Blogs</h1>
            <div className="w-16"/>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-3 mb-1">
              <BookmarkCheck size={20} className="text-[#e94560]"/>
              <h2 className="sb-serif text-[#1a1a2e] text-2xl font-semibold">Your Collection</h2>
            </div>
            <p className="text-gray-400 text-sm ml-8">
              {loading ? "Loading..." : `${blogs.length} saved article${blogs.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse flex gap-4">
                  <div className="w-1 h-16 bg-gray-100 rounded-full shrink-0"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/5"/>
                    <div className="h-4 bg-gray-100 rounded w-3/4"/>
                    <div className="h-3 bg-gray-100 rounded w-1/2"/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && blogs.length === 0 && (
            <div className="text-center py-24 fade-up">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bookmark size={28} className="text-gray-300"/>
              </div>
              <h3 className="sb-serif text-[#1a1a2e] text-xl font-semibold mb-2">Nothing saved yet</h3>
              <p className="text-gray-400 text-sm mb-6">
                Bookmark blogs while reading to save them here.
              </p>
              <button onClick={() => navigate("/")}
                className="bg-[#e94560] hover:bg-[#d13a52] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition">
                Browse Blogs
              </button>
            </div>
          )}

          {/* Blog list */}
          {!loading && blogs.length > 0 && (
            <div className="space-y-3 fade-up">
              {blogs.map((blog, idx) => {
                const cat = getCat(blog.tags);
                const c   = TAG_MAP[cat];
                const rt  = readTime(blog.content);
                return (
                  <div key={blog._id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4
                      hover:shadow-sm hover:border-gray-200 transition-all"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* colored left strip */}
                    <div className="w-1 self-stretch rounded-full shrink-0"
                      style={{ background: c.color }}/>

                    {/* content */}
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetailBlog(blog)}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md"
                          style={{ background: c.light, color: c.color }}>
                          {cat}
                        </span>
                        <span className="text-gray-300 text-[10px] flex items-center gap-0.5">
                          <Clock size={9}/> {rt}m
                        </span>
                        {(blog.views||0) > 0 && (
                          <span className="text-gray-300 text-[10px] flex items-center gap-0.5">
                            <Eye size={9}/> {blog.views}
                          </span>
                        )}
                      </div>

                      <h3 className="sb-serif text-[#1a1a2e] font-semibold text-base leading-snug mb-1
                        hover:text-[#e94560] transition-colors line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-1 mb-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-[0.68rem] text-gray-300">
                        <span>{blog.author?.name}</span>
                        <span>·</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => setDetailBlog(blog)}
                        className="text-xs font-medium text-[#e94560] border border-[#e94560]/30 px-3 py-1.5 rounded-lg hover:bg-[#e94560] hover:text-white transition"
                      >
                        Read →
                      </button>
                      <button
                        onClick={() => handleRemove(blog._id)}
                        disabled={removing === blog._id}
                        className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-red-400 transition disabled:opacity-50"
                      >
                        <Trash2 size={11}/>
                        {removing === blog._id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {detailBlog && (
        <BlogDetailModal blog={detailBlog} onClose={() => setDetailBlog(null)}/>
      )}
    </>
  );
}