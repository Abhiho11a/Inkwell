import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Eye, Heart, MessageCircle, BookOpen,
  TrendingUp, Award, Calendar, Tag, BarChart2, RefreshCw
} from "lucide-react";

const API = "http://127.0.0.1:8000";

// ── tiny stat card ────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className={`rounded-2xl p-5 border flex items-center gap-4
      ${accent
        ? "bg-[#1a1a2e] border-[#2d2d4e] text-white"
        : "bg-white border-gray-100"}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0
        ${accent ? "bg-[#e94560]/20" : "bg-[#f8f7f4]"}`}
      >
        <Icon size={20} className={accent ? "text-[#e94560]" : "text-[#1a1a2e]"} />
      </div>
      <div>
        <p className={`text-[0.72rem] font-medium tracking-wide uppercase
          ${accent ? "text-white/50" : "text-gray-400"}`}>{label}</p>
        <p className={`text-2xl font-semibold font-serif mt-0.5
          ${accent ? "text-white" : "text-[#1a1a2e]"}`}>{value}</p>
      </div>
    </div>
  );
}

// ── mini bar (visual view bar per blog) ──────────────────────────────────────
function MiniBar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#e94560] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[0.7rem] text-gray-400 w-6 text-right">{value}</span>
    </div>
  );
}

// ── read time badge ───────────────────────────────────────────────────────────
function ReadBadge({ mins }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-500 text-[0.68rem] px-2 py-0.5 rounded-full">
      <BookOpen size={10} /> {mins} min
    </span>
  );
}

export default function Analytics() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("views"); // views | comments | date

  useEffect(() => {
    if (!user?.id) { navigate("/login"); return; }
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/analytics/${user.id}`);
      const json = await res.json();
      if (json.status === "Success") setData(json.data);
      else setError(json.message);
    } catch {
      setError("Could not load analytics. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  // sorted blogs
  const sorted = data
    ? [...data.blogs].sort((a, b) => {
        if (sortBy === "views") return b.views - a.views;
        if (sortBy === "comments") return b.comments - a.comments;
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    : [];

  const maxViews = sorted.length > 0 ? sorted[0].views || 1 : 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .an-font  { font-family: 'DM Sans', sans-serif; }
        .an-serif { font-family: 'Lora', serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div className="an-font min-h-screen bg-[#f8f7f4]">

        {/* ── Navbar ── */}
        <nav className="bg-[#1a1a2e] sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="an-serif text-white text-xl font-semibold tracking-tight">
              Analytics
            </h1>
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* ── Page header ── */}
          <div className="mb-8 fade-up">
            <span className="inline-block bg-[#1a1a2e] text-[#e94560] text-[0.7rem] font-medium tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4">
              Your Stats
            </span>
            <h2 className="an-serif text-[#1a1a2e] text-3xl font-semibold leading-tight">
              Writer Dashboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Track how your blogs are performing across all readers.
            </p>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 h-24 animate-pulse" />
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl px-5 py-4 text-sm mb-8">
              ⚠️ {error}
            </div>
          )}

          {/* ── Stats grid ── */}
          {data && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 fade-up">
                <StatCard icon={Eye}           label="Total Views"    value={data.totalViews}    accent />
                <StatCard icon={BookOpen}      label="Blogs Written"  value={data.totalBlogs} />
                <StatCard icon={MessageCircle} label="Total Comments" value={data.totalComments} />
                <StatCard icon={Heart}         label="Total Likes"    value={data.totalLikes} />
              </div>

              {/* ── Top Blog highlight ── */}
              {data.topBlog && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 fade-up flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-2xl">
                    🏆
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.7rem] text-amber-500 font-semibold tracking-widest uppercase mb-1">
                      Top Performing Blog
                    </p>
                    <h3 className="an-serif text-[#1a1a2e] text-lg font-semibold truncate">
                      {data.topBlog.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye size={12} className="text-[#e94560]" /> {data.topBlog.views} views
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MessageCircle size={12} className="text-blue-400" /> {data.topBlog.comments} comments
                      </span>
                      <ReadBadge mins={data.topBlog.readTime} />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${data.topBlog._id}`)}
                    className="shrink-0 text-xs font-medium text-[#e94560] border border-[#e94560]/30 px-4 py-2 rounded-lg hover:bg-[#e94560] hover:text-white transition-colors"
                  >
                    View Blog →
                  </button>
                </div>
              )}

              {/* ── Sort controls ── */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <p className="text-sm font-medium text-[#1a1a2e] flex items-center gap-2">
                  <BarChart2 size={15} className="text-[#e94560]" />
                  All Blogs
                  <span className="text-gray-300 font-normal">({data.totalBlogs})</span>
                </p>
                <div className="flex gap-2">
                  {["views", "comments", "date"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      className={`text-[0.72rem] px-3 py-1.5 rounded-lg border font-medium capitalize transition
                        ${sortBy === opt
                          ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-[#1a1a2e]"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Blog table ── */}
              {sorted.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center">
                  <BookOpen size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-[#1a1a2e] font-serif text-lg font-semibold mb-1">No blogs yet</p>
                  <p className="text-gray-400 text-sm mb-5">Start writing to see your stats here.</p>
                  <button
                    onClick={() => navigate("/create-blog")}
                    className="bg-[#e94560] text-white text-sm px-6 py-2.5 rounded-xl hover:bg-[#d13a52] transition"
                  >
                    Write your first blog
                  </button>
                </div>
              ) : (
                <div className="space-y-3 fade-up">
                  {sorted.map((blog, idx) => (
                    <div
                      key={blog._id}
                      className="bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      {/* top row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* rank */}
                          <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold mt-0.5
                            ${idx === 0 ? "bg-amber-100 text-amber-600"
                            : idx === 1 ? "bg-gray-100 text-gray-500"
                            : idx === 2 ? "bg-orange-50 text-orange-400"
                            : "bg-gray-50 text-gray-300"}`}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="an-serif text-[#1a1a2e] font-semibold text-sm leading-snug truncate">
                              {blog.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 text-[0.7rem] text-gray-400">
                                <Calendar size={10} />
                                {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                                  day: "2-digit", month: "short", year: "numeric"
                                })}
                              </span>
                              <ReadBadge mins={blog.readTime} />
                            </div>
                          </div>
                        </div>

                        {/* stats pills */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="flex items-center gap-1 bg-red-50 text-[#e94560] text-[0.7rem] px-2.5 py-1 rounded-full font-medium">
                            <Eye size={10} /> {blog.views}
                          </span>
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-500 text-[0.7rem] px-2.5 py-1 rounded-full font-medium">
                            <MessageCircle size={10} /> {blog.comments}
                          </span>
                          <span className="flex items-center gap-1 bg-pink-50 text-pink-400 text-[0.7rem] px-2.5 py-1 rounded-full font-medium">
                            <Heart size={10} /> {blog.likes}
                          </span>
                        </div>
                      </div>

                      {/* views bar */}
                      <MiniBar value={blog.views} max={maxViews} />

                      {/* tags */}
                      {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {blog.tags.slice(0, 4).map((t, i) => (
                            <span key={i} className="bg-gray-50 text-gray-400 text-[0.65rem] px-2 py-0.5 rounded-full border border-gray-100">
                              #{t}
                            </span>
                          ))}
                          {blog.tags.length > 4 && (
                            <span className="text-gray-300 text-[0.65rem]">+{blog.tags.length - 4} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Footer summary ── */}
              {data.totalBlogs > 0 && (
                <div className="mt-8 bg-[#1a1a2e] rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4 fade-up">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Average per blog</p>
                    <p className="text-white an-serif text-lg font-semibold">
                      {Math.round(data.totalViews / data.totalBlogs)} views ·{" "}
                      {Math.round(data.totalComments / data.totalBlogs)} comments
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/create-blog")}
                    className="bg-[#e94560] hover:bg-[#d13a52] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
                  >
                    + Write New Blog
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}