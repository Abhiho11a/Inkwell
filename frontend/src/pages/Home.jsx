import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut, UserCircle, Search, ArrowRight,
  Lock, BarChart2, Clock, Eye, Flame, X, Feather, PenSquare,
  Bookmark,
  NotebookPen
} from "lucide-react";
import BlogDetailModal from "../components/BlogDetailModal";

const API = import.meta.env.VITE_API_URL;

const TAG_MAP = {
  Tech:     { color:"#3b82f6", light:"#eff6ff", kw:["react","javascript","js","node","python","typescript","nextjs","express","mongodb","sql","api","backend","frontend","fullstack","web","coding","programming","developer","software","github","git","docker","aws","cloud","ai","ml"] },
  Design:   { color:"#ec4899", light:"#fdf2f8", kw:["ui","ux","design","figma","css","tailwind","animation","typography","graphic","illustration"] },
  Career:   { color:"#10b981", light:"#ecfdf5", kw:["job","career","resume","interview","placement","linkedin","internship","hiring","portfolio"] },
  Tutorial: { color:"#f59e0b", light:"#fffbeb", kw:["tutorial","learn","course","study","beginner","guide","tips","roadmap","how to"] },
  Startup:  { color:"#f97316", light:"#fff7ed", kw:["startup","product","saas","business","entrepreneur","mvp","founder"] },
  Life:     { color:"#8b5cf6", light:"#f5f3ff", kw:["life","mindset","motivation","productivity","personal","growth","story","opinion"] },
  General:  { color:"#94a3b8", light:"#f8fafc", kw:[] },
};

function getCat(tags) {
  if (!tags?.length) return "General";
  const norm = tags.flatMap(t => t.toLowerCase().trim().split(/\s+/));
  for (const [name, cfg] of Object.entries(TAG_MAP)) {
    if (name === "General") continue;
    if (cfg.kw.some(k => norm.includes(k))) return name;
  }
  return "General";
}

const readTime = content => Math.ceil((content?.split(" ").length || 0) / 200) || 1;

// ── tiny category badge ───────────────────────────────────────────────────────
function Badge({ cat }) {
  const c = TAG_MAP[cat] || TAG_MAP.General;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md"
      style={{ background: c.light, color: c.color }}>
      {cat}
    </span>
  );
}

// ── Blog card — pure compact ──────────────────────────────────────────────────
function Card({ post, isLoggedIn, onReadMore }) {
  const cat = getCat(post.tags);
  const c   = TAG_MAP[cat];
  const rt  = readTime(post.content);

  return (
    <article
      onClick={() => onReadMore(post)}
      className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3
        hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200
        transition-all duration-200 cursor-pointer group"
    >
      {/* top row: badge + meta */}
      <div className="flex items-center justify-between">
        <Badge cat={cat} />
        <div className="flex items-center gap-2 text-gray-300 text-[10px]">
          <span className="flex items-center gap-0.5"><Clock size={9}/> {rt}m</span>
          {(post.views||0) > 0 && <span className="flex items-center gap-0.5"><Eye size={9}/> {post.views}</span>}
        </div>
      </div>

      {/* title */}
      <h3 className="font-serif text-[0.95rem] font-semibold text-[#1a1a2e] leading-snug
        group-hover:text-[#e94560] transition-colors line-clamp-2">
        {post.title}
      </h3>

      {/* excerpt */}
      <p className="text-gray-400 text-[0.78rem] leading-relaxed line-clamp-2 flex-1">
        {post.excerpt}
      </p>

      {/* tags */}
      {post.tags?.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {post.tags.slice(0,3).map((t,i) => (
            <span key={i} className="text-[0.6rem] text-gray-300 border border-gray-100 px-1.5 py-0.5 rounded">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full text-white text-[8px] font-bold flex items-center justify-center shrink-0"
            style={{ background: c.color }}>
            {post.author?.name?.slice(0,2).toUpperCase() ?? "AB"}
          </div>
          <span className="text-[0.68rem] text-gray-400 truncate max-w-[100px]">{post.author?.name}</span>
          <span className="text-gray-200 text-[10px]">·</span>
          <span className="text-[0.68rem] text-gray-300">
            {new Date(post.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}
          </span>
        </div>

        {isLoggedIn ? (
          <span className="text-[#e94560] text-[0.7rem] font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            Read <ArrowRight size={10}/>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[0.65rem] text-gray-300 border border-gray-100 px-1.5 py-0.5 rounded-lg group-hover:border-[#e94560] group-hover:text-[#e94560] transition-all">
            <Lock size={8}/> Read
          </span>
        )}
      </div>
    </article>
  );
}

// ── Trending mini row ─────────────────────────────────────────────────────────
function TrendRow({ post, rank, onReadMore, isLoggedIn }) {
  const cat = getCat(post.tags);
  const c   = TAG_MAP[cat];
  return (
    <div onClick={() => onReadMore(post)}
      className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer group">
      <span className="text-lg font-serif font-bold text-gray-100 w-5 shrink-0 leading-none mt-0.5">
        {rank}
      </span>
      <div className="min-w-0">
        <p className="text-[0.75rem] font-semibold text-[#1a1a2e] leading-snug line-clamp-2
          group-hover:text-[#e94560] transition-colors">
          {post.title}
        </p>
        <p className="text-[0.65rem] text-gray-300 mt-0.5">{post.author?.name}</p>
      </div>
    </div>
  );
}

// ── Login prompt ──────────────────────────────────────────────────────────────
function LoginPrompt({ blog, onClose, onLogin }) {
  const cat = getCat(blog?.tags);
  const c   = TAG_MAP[cat];
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 relative"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-200 hover:text-gray-500">
          <X size={16}/>
        </button>
        <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
          style={{ background: c.light }}>
          <Feather size={18} style={{ color: c.color }}/>
        </div>
        <h2 className="font-serif text-[#1a1a2e] text-lg font-semibold mb-1">Login to read</h2>
        <p className="text-gray-400 text-xs mb-5 line-clamp-2">"{blog?.title}"</p>
        <div className="flex gap-2">
          <button onClick={onLogin}
            className="flex-1 border border-gray-200 hover:border-[#1a1a2e] text-[#1a1a2e] py-2.5 rounded-xl text-sm font-medium transition">
            Login
          </button>
          <Link to="/signup"
            className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium text-center transition"
            style={{ background: c.color }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);
  const [activeTag, setActiveTag]     = useState("All");
  const navigate                      = useNavigate();
  const [isLoggedIn, setIsLoggedIn]   = useState(!!localStorage.getItem("token"));
  const [detailedView, setDetailedView] = useState(null);
  const [loginBlog, setLoginBlog]     = useState(null);
  const [blogs, setBlogs]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [totalPages, setTotalPages]   = useState(1);

  const LIMIT = 9;
  const FILTERS = ["All","Tech","Design","Career","Tutorial","Startup","Life"];

  useEffect(() => { fetchBlogs(page); }, [page]);

  async function fetchBlogs(p) {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/blogs?page=${p}&limit=${LIMIT}`);
      const data = await res.json();
      if (data.message === "Success") {
        setBlogs(data.data);
        if (data.totalPages) setTotalPages(data.totalPages);
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  const filtered = blogs.filter(b => {
    const matchTag    = activeTag === "All" || getCat(b.tags) === activeTag;
    const matchSearch = !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.name?.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const sorted   = [...filtered].sort((a,b) => (b.views||0)-(a.views||0));
  const trending = sorted.slice(0,5);

  function handleReadMore(post) {
    if (!isLoggedIn) { setLoginBlog(post); return; }
    setDetailedView(post);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family:'DM Sans',sans-serif; }
        .serif { font-family:'Lora',serif; }
      `}</style>

      <div className="min-h-screen bg-[#f8f7f4]">

        {/* NAVBAR */}
        <nav className="bg-[#1a1a2e] sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
            <h1 className="serif text-xl text-white mr-2">Blog<span className="text-[#e94560]">ify</span></h1>

            {/* search */}
            <div className="flex-1 max-w-xs hidden md:flex items-center bg-white/8 border border-white/10 rounded-lg px-3 gap-2">
              <Search size={12} className="text-white/30 shrink-0"/>
              <input type="text" placeholder="Search..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="bg-transparent text-white text-xs py-2 outline-none placeholder-white/30 w-full"/>
            </div>

            <div className="flex items-center gap-1 ml-auto">
              {isLoggedIn ? (<>
                <Link to="/myblog" className="text-white/50 text-xs hover:text-white transition px-3 py-2 flex items-center gap-1">
                  <NotebookPen size={11}/> My Blogs</Link>
                <Link to="/analytics" className="text-white/50 text-xs hover:text-white transition px-3 py-2 flex items-center gap-1">
                  <BarChart2 size={11}/> Analytics
                </Link>
                <Link to="/saved" className="text-white/50 text-xs hover:text-white transition px-3 py-2 flex items-center gap-1">
                  <Bookmark size={11}/> Saved
                </Link>
                <Link to="/create-blog" className="ml-1 flex items-center gap-1.5 bg-[#e94560] hover:bg-[#d13a52] text-white text-xs font-medium px-3 py-2 rounded-lg transition">
                  <PenSquare size={11}/> Write
                </Link>
                <UserCircle size={18} className="text-white/40 hover:text-white cursor-pointer transition ml-2"
                  onClick={() => navigate("/profile")}/>
                <LogOut size={16} className="text-white/30 hover:text-white cursor-pointer transition ml-1"
                  onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); setIsLoggedIn(false); }}/>
              </>) : (<>
                <button onClick={() => navigate("/login")} className="text-white/50 text-xs hover:text-white transition px-3 py-2">Login</button>
                <button onClick={() => navigate("/signup")} className="bg-[#e94560] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#d13a52] transition ml-1">Register</button>
              </>)}
            </div>
          </div>
        </nav>

        {/* PAGE BODY */}
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* filters row */}
          <div className="flex items-center gap-2 flex-wrap mb-7">
            {FILTERS.map(tag => (
              <button key={tag} onClick={() => { setActiveTag(tag); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition
                  ${activeTag === tag
                    ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"}`}>
                {tag}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-300">{filtered.length} articles</span>
          </div>

          {/* 2-col layout: cards left, sidebar right */}
          <div className="grid lg:grid-cols-[1fr_240px] gap-8">

            {/* LEFT — card grid */}
            <div>
              {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
                      <div className="h-3 bg-gray-100 rounded-full w-1/4"/>
                      <div className="h-4 bg-gray-100 rounded w-4/5"/>
                      <div className="h-3 bg-gray-100 rounded w-full"/>
                      <div className="h-3 bg-gray-100 rounded w-2/3"/>
                      <div className="h-px bg-gray-50 mt-2"/>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-100 rounded w-1/3"/>
                        <div className="h-3 bg-gray-100 rounded w-10"/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-200 text-5xl mb-3 font-serif">✦</p>
                  <p className="text-gray-400 text-sm">No blogs found.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filtered.map((post, idx) => (
                    <Card key={post._id} post={post} isLoggedIn={isLoggedIn}
                      onReadMore={handleReadMore} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-5">

              {/* Trending */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-1.5 mb-4">
                  <Flame size={13} className="text-[#e94560]"/>
                  <h3 className="text-[0.7rem] font-bold text-[#1a1a2e] tracking-widest uppercase">Trending</h3>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i=><div key={i} className="h-8 bg-gray-50 rounded animate-pulse"/>)}
                  </div>
                ) : trending.length === 0 ? (
                  <p className="text-gray-300 text-xs">No posts yet.</p>
                ) : trending.map((post,i) => (
                  <TrendRow key={post._id} post={post} rank={i+1}
                    onReadMore={handleReadMore} isLoggedIn={isLoggedIn}/>
                ))}
              </div>

              {/* Write CTA */}
              {isLoggedIn ? (
                <div className="bg-[#1a1a2e] rounded-2xl p-5 text-center">
                  <p className="serif text-white text-sm font-semibold mb-1">Share your story</p>
                  <p className="text-white/40 text-xs mb-4">Write a blog and reach thousands of readers.</p>
                  <Link to="/create-blog"
                    className="block bg-[#e94560] hover:bg-[#d13a52] text-white text-xs font-medium py-2.5 rounded-xl transition">
                    + Write a Blog
                  </Link>
                </div>
              ) : (
                <div className="bg-[#1a1a2e] rounded-2xl p-5 text-center">
                  <p className="serif text-white text-sm font-semibold mb-1">Join Blogify</p>
                  <p className="text-white/40 text-xs mb-4">Read full articles, comment, and share your stories.</p>
                  <button onClick={() => navigate("/signup")}
                    className="w-full bg-[#e94560] hover:bg-[#d13a52] text-white text-xs font-medium py-2.5 rounded-xl transition mb-2">
                    Sign Up Free
                  </button>
                  <button onClick={() => navigate("/login")}
                    className="w-full border border-white/10 text-white/50 hover:text-white text-xs py-2 rounded-xl transition">
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition disabled:opacity-30 text-sm flex items-center justify-center">‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                <button key={n} onClick={()=>setPage(n)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition
                    ${n===page ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "bg-white text-gray-500 border-gray-200 hover:border-[#1a1a2e]"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition disabled:opacity-30 text-sm flex items-center justify-center">›</button>
            </div>
          )}
        </div>
      </div>

      {detailedView && <BlogDetailModal blog={detailedView} onClose={() => setDetailedView(null)}/>}
      {loginBlog && <LoginPrompt blog={loginBlog} onClose={() => setLoginBlog(null)} onLogin={() => navigate("/login")}/>}
    </>
  );
}