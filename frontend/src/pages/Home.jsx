import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserCircle, Search, ArrowRight } from "lucide-react";
import BlogDetailModal from "../components/BlogDetailModal";

const TAG_CATEGORIES = [
  {
    keywords: ["react", "javascript", "js", "node", "python", "java", "cpp",
               "c++", "typescript", "ts", "nextjs", "express", "mongodb",
               "sql", "database", "api", "backend", "frontend", "fullstack",
               "web", "coding", "programming", "developer", "software",
               "github", "git", "docker", "aws", "cloud", "ml", "ai",
               "machine learning", "deep learning", "data science"],
    bg: "bg-blue-50",
    emoji: "🚀"
  },
  {
    keywords: ["ui", "ux", "ui/ux", "design", "figma", "css", "tailwind",
               "bootstrap", "animation", "typography", "color", "wireframe",
               "prototype", "graphic", "illustration", "canva"],
    bg: "bg-red-50",
    emoji: "✍️"
  },
  {
    keywords: ["job", "career", "resume", "interview", "placement", "linkedin",
               "fresher", "internship", "salary", "hiring", "hr", "offer",
               "campus", "referral", "portfolio", "networking"],
    bg: "bg-green-50",
    emoji: "🛠️"
  },
  {
    keywords: ["tutorial", "learn", "course", "study", "beginner", "guide",
               "tips", "tricks", "how to", "roadmap", "resources", "book",
               "notes", "lecture", "education", "college", "student"],
    bg: "bg-amber-50",
    emoji: "💡"
  },
  {
    keywords: ["startup", "product", "launch", "saas", "idea", "business",
               "entrepreneur", "mvp", "founder", "buildinpublic", "indie"],
    bg: "bg-orange-50",
    emoji: "🌱"
  },
  {
    keywords: ["life", "mindset", "motivation", "productivity", "habit",
               "personal", "growth", "mental health", "experience",
               "journey", "story", "reflection", "opinion"],
    bg: "bg-purple-50",
    emoji: "✨"
  },

  // ← default (no keywords, always last)
  {
    keywords: [],
    bg: "bg-gray-50",
    emoji: "📝"
  }
];
const getCategoryFromTags = (tags) => {
  if (!tags || tags.length === 0)
    return TAG_CATEGORIES[TAG_CATEGORIES.length - 1]; // last = default

  const normalizedTags = tags.flatMap(t =>
    t.toLowerCase().trim().split(/\s+/)
  );

  for (const category of TAG_CATEGORIES) {
    if (category.keywords.length === 0) continue;
    const matched = category.keywords.some(keyword =>
      normalizedTags.some(tag => tag === keyword)
    );
    if (matched) return category;
  }

  return TAG_CATEGORIES[TAG_CATEGORIES.length - 1]; // default
};

const TAGS = ["All", "Tech", "Design", "Career", "Tutorial"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(1);
  const [activeTag, setActiveTag] = useState("All");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [detailedView, setDetailedView] = useState("");
  const [blogs, setBlogs] = useState([]);

  const maxPagination = 5;
  const numbers = Array.from({ length: maxPagination }, (_, i) => i + 1);

  useEffect(() => {
    fetchBlogs(pagination);
  }, [pagination]);

  async function fetchBlogs(page) {
    const response = await fetch(
      `http://127.0.0.1:8000/api/blogs?page=${page}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (!response.ok) alert(data.message);
    else setBlogs(data.data);
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      {/* ── Navbar ── */}
      <nav className="bg-[#1a1a2e] sticky top-0 z-50 px-6 h-[60px] flex items-center justify-between">
        <h1 className="font-serif text-2xl text-white tracking-tight">
          Blog<span className="text-[#e94560]">ify</span>
        </h1>

        {isLoggedIn ? (
          <div className="flex items-center gap-6">
            <Link to="/myblog" className="text-white/70 text-sm hover:text-white transition">
              My Blogs
            </Link>
            <Link to="/create-blog" className="text-white/70 text-sm hover:text-white transition">
              Create Blog
            </Link>
            <Link to="/analytics" className="text-white/70 text-sm hover:text-white transition">
              Analytics
            </Link>
            <UserCircle
              size={20}
              className="text-white/70 hover:text-white cursor-pointer transition"
              onClick={() => navigate("/profile")}
            />
            <LogOut
              size={20}
              className="text-white/70 hover:text-white cursor-pointer transition"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsLoggedIn(false);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-white/70 text-sm hover:text-white transition px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#e94560] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#d13a52] transition"
            >
              Register
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="text-center pt-14 pb-8 px-6 max-w-2xl mx-auto">
        <span className="inline-block bg-[#1a1a2e] text-[#e94560] text-[11px] font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
          Developer Community
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a1a2e] leading-tight tracking-tight mb-4">
          Discover & Share{" "}
          <em className="text-[#e94560] not-italic">Amazing</em> Blogs
        </h2>
        <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto">
          Explore articles from developers around the world. Search, read, and
          grow your knowledge one post at a time.
        </p>
      </section>

      {/* ── Search ── */}
      <div className="max-w-xl mx-auto px-6 mb-10">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:border-[#e94560] transition-colors">
          <input
            type="text"
            placeholder="Search blogs, topics, authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-5 py-3.5 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
          />
          <button className="bg-[#e94560] text-white px-6 py-3.5 text-sm font-medium hover:bg-[#d13a52] transition flex items-center gap-2">
            <Search size={15} />
            Search
          </button>
        </div>
      </div>

      {/* ── Filter Tags ── */}
      <div className="max-w-5xl mx-auto px-6 mb-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-400 font-medium tracking-wide">Latest posts</p>
        <div className="flex gap-2 flex-wrap">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition
                ${activeTag === tag
                  ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Blog Grid ── */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-400 py-16 text-sm">No blogs found.</p>
      ) : (
        <div className="max-w-5xl mx-auto px-6 pb-14">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((post, idx) => {
              const category = getCategoryFromTags(post.tags)
              return (
                <div
                  key={post._id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
                >
                  {/* Banner */}
                  <div className={`${category.bg} h-36 flex items-center justify-center text-4xl`}>
                    {category.emoji}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[#e94560] text-[10px] font-semibold tracking-widest uppercase mb-2">
                      Article
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#1a1a2e] leading-snug mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1a1a2e] text-white text-[10px] font-semibold flex items-center justify-center">
                        {post.author?.name?.slice(0, 2).toUpperCase() ?? "AB"}
                      </div>
                      <span className="text-xs text-gray-400">
                        {post.author?.name} ·{" "}
                        {new Date(post.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => setDetailedView(post)}
                      className="text-[#e94560] text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Pagination ── */}
      <div className="flex justify-center items-center gap-2 pb-14">
        <button
          onClick={() => setPagination((prev) => (prev === 1 ? maxPagination : prev - 1))}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition flex items-center justify-center text-sm"
        >
          ‹
        </button>

        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => setPagination(num)}
            className={`w-9 h-9 rounded-lg border text-sm font-medium transition
              ${num === pagination
                ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
              }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPagination((prev) => (prev === maxPagination ? 1 : prev + 1))}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition flex items-center justify-center text-sm"
        >
          ›
        </button>
      </div>

      {/* ── Modal ── */}
      {detailedView && (
        <BlogDetailModal blog={detailedView} onClose={() => setDetailedView("")} />
      )}
    </div>
  );
}