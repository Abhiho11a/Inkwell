import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, Loader2, RefreshCw, Check, X } from "lucide-react";

const API = "http://127.0.0.1:8000";

// ── Small reusable AI button ──────────────────────────────────────────────────
function AIBtn({ onClick, loading, label, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="ai-btn"
    >
      {loading ? <Loader2 size={11} className="ai-spin" /> : icon || <Sparkles size={11} />}
      {label}
    </button>
  );
}

// ── Title suggestion pill ─────────────────────────────────────────────────────
function TitlePill({ title, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(title)}
      className="title-pill"
    >
      {title}
    </button>
  );
}

export default function CreateBlog() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({ title: "", excerpt: "", content: "", tags: "" });
  const [loading, setLoading] = useState(false);

  // AI states
  const [aiLoading, setAiLoading] = useState({
    titles: false, summarize: false, continue: false, improve: false, tags: false,
  });
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [aiNotice, setAiNotice] = useState(""); // small toast message

  // ── helpers ──────────────────────────────────────────────────────────────────
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  function setAiLoad(key, val) {
    setAiLoading((p) => ({ ...p, [key]: val }));
  }

  function flash(msg) {
    setAiNotice(msg);
    setTimeout(() => setAiNotice(""), 3000);
  }

  async function callAI(endpoint, body) {
    const res = await fetch(`${API}/api/ai/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  // ── 1. Suggest Titles ────────────────────────────────────────────────────────
  async function handleSuggestTitles() {
    if (!formData.content && !formData.title) return flash("Write some content first!");
    setAiLoad("titles", true);
    setTitleSuggestions([]);
    try {
      const data = await callAI("titles", { content: formData.content || formData.title });
      if (data.status === "Success") setTitleSuggestions(data.data);
      else flash("Couldn't fetch titles. Try again.");
    } catch { flash("AI error. Check your connection."); }
    finally { setAiLoad("titles", false); }
  }

  // ── 2. Auto-generate Excerpt ─────────────────────────────────────────────────
  async function handleSummarize() {
    if (!formData.content) return flash("Write your content first!");
    setAiLoad("summarize", true);
    try {
      const data = await callAI("summarize", { content: formData.content });
      if (data.status === "Success") {
        setFormData((p) => ({ ...p, excerpt: data.data }));
        flash("✓ Excerpt generated!");
      }
    } catch { flash("AI error."); }
    finally { setAiLoad("summarize", false); }
  }

  // ── 3. Continue Writing ───────────────────────────────────────────────────────
  async function handleContinue() {
    if (!formData.content) return flash("Write something first!");
    setAiLoad("continue", true);
    try {
      const data = await callAI("continue", { content: formData.content });
      if (data.status === "Success") {
        setFormData((p) => ({ ...p, content: p.content + " " + data.data }));
        flash("✓ Content extended!");
      }
    } catch { flash("AI error."); }
    finally { setAiLoad("continue", false); }
  }

  // ── 4. Improve Writing ───────────────────────────────────────────────────────
  async function handleImprove() {
    if (!formData.content) return flash("Nothing to improve yet!");
    setAiLoad("improve", true);
    try {
      const data = await callAI("improve", { sentence: formData.content, tone: "engaging" });
      if (data.status === "Success") {
        setFormData((p) => ({ ...p, content: data.data }));
        flash("✓ Writing improved!");
      }
    } catch { flash("AI error."); }
    finally { setAiLoad("improve", false); }
  }

  // ── 5. Auto Tags ─────────────────────────────────────────────────────────────
  async function handleAutoTags() {
    if (!formData.content) return flash("Write content first!");
    setAiLoad("tags", true);
    try {
      const data = await callAI("tags", { content: formData.content });
      if (data.status === "Success") {
        setFormData((p) => ({ ...p, tags: data.data.join(", ") }));
        flash("✓ Tags generated!");
      }
    } catch { flash("AI error."); }
    finally { setAiLoad("tags", false); }
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newBlog = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: { name: user?.name, _id: user?._id },
      createdAt: new Date().toISOString(),
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      comments: [],
    };
    try {
      const response = await fetch(`${API}/api/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newBlog, userId: user }),
      });
      const data = await response.json();
      if (data.status === "Success") { alert(data.message); navigate("/myblog"); }
      else alert(data.message);
    } catch (error) {
      console.error("Blog creation failed:", error);
    } finally { setLoading(false); }
  };

  const tagList = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

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
          box-sizing: border-box;
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

        /* ── AI Button ── */
        .ai-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #a78bfa;
          border: 1px solid #2d2d4e;
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 0.72rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .ai-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
          color: #fff;
          border-color: #7c3aed;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124,58,237,0.25);
        }
        .ai-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .ai-spin { animation: spin 0.7s linear infinite; }

        /* ── Title pill ── */
        .title-pill {
          display: block;
          width: 100%;
          text-align: left;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          border-radius: 8px;
          padding: 9px 13px;
          font-size: 0.82rem;
          font-family: 'DM Sans', sans-serif;
          color: #4c1d95;
          cursor: pointer;
          transition: all 0.15s;
        }
        .title-pill:hover {
          background: #ede9fe;
          border-color: #7c3aed;
          color: #1a1a2e;
        }

        /* ── AI Notice toast ── */
        .ai-notice {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: #1a1a2e;
          color: #a78bfa;
          border: 1px solid #2d2d4e;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          z-index: 9999;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          animation: slideIn 0.25s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* field row: label on left, ai buttons on right */
        .field-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;
          flex-wrap: wrap;
          gap: 6px;
        }
        .ai-btn-group {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
      `}</style>

      {/* Toast */}
      {aiNotice && <div className="ai-notice">✦ {aiNotice}</div>}

      <div className="cb-font min-h-screen bg-[#f8f7f4]">

        {/* Navbar */}
        <nav className="bg-[#1a1a2e] sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-6 h-[60px] flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="cb-serif text-white text-xl font-semibold tracking-tight">Create Blog</h1>
            <div className="w-16" />
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">

          {/* Page Header */}
          <div className="mb-8">
            <span className="inline-block bg-[#1a1a2e] text-[#e94560] text-[0.7rem] font-medium tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4">
              New Post
            </span>
            <h2 className="cb-serif text-[#1a1a2e] text-4xl font-semibold tracking-tight leading-tight">
              Write Something<br />
              <em className="not-italic text-[#e94560]">Amazing</em>
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Fill in the details below. Use the{" "}
              <span className="text-purple-500 font-medium">✦ AI buttons</span>{" "}
              to supercharge your writing.
            </p>
          </div>

          {/* AI Feature Strip */}
          <div className="mb-6 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border border-[#2d2d4e] rounded-2xl px-5 py-4 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-medium mr-2">
              <Sparkles size={13} />
              AI Assistant
            </div>
            <div className="w-px h-4 bg-white/10" />
            <p className="text-white/40 text-[0.72rem]">
              Each field has an AI button — generate titles, auto-write excerpts, continue content & more.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── TITLE ── */}
              <div>
                <div className="field-header">
                  <label className="cb-label" style={{ marginBottom: 0 }}>Blog Title</label>
                  <AIBtn
                    onClick={handleSuggestTitles}
                    loading={aiLoading.titles}
                    label="Suggest Titles"
                  />
                </div>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a catchy title..."
                  className="cb-input"
                />
                {/* Title suggestions dropdown */}
                {titleSuggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[0.72rem] text-purple-500 font-medium">Pick a title ↓</p>
                      <button
                        type="button"
                        onClick={() => setTitleSuggestions([])}
                        className="text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    {titleSuggestions.map((t, i) => (
                      <TitlePill
                        key={i}
                        title={t}
                        onPick={(picked) => {
                          setFormData((p) => ({ ...p, title: picked }));
                          setTitleSuggestions([]);
                          flash("✓ Title selected!");
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── EXCERPT ── */}
              <div>
                <div className="field-header">
                  <label className="cb-label" style={{ marginBottom: 0 }}>Excerpt</label>
                  <AIBtn
                    onClick={handleSummarize}
                    loading={aiLoading.summarize}
                    label="Auto-Generate from Content"
                  />
                </div>
                <textarea
                  name="excerpt"
                  required
                  rows="3"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Short summary of your blog... or let AI write it ✦"
                  className="cb-input"
                />
              </div>

              {/* ── CONTENT ── */}
              <div>
                <div className="field-header">
                  <label className="cb-label" style={{ marginBottom: 0 }}>Content</label>
                  <div className="ai-btn-group">
                    <AIBtn
                      onClick={handleContinue}
                      loading={aiLoading.continue}
                      label="Continue Writing"
                      icon={<RefreshCw size={11} />}
                    />
                    <AIBtn
                      onClick={handleImprove}
                      loading={aiLoading.improve}
                      label="Improve Writing"
                      icon={<Sparkles size={11} />}
                    />
                  </div>
                </div>
                <textarea
                  name="content"
                  required
                  rows="10"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your full blog content here... or start with a sentence and let AI continue ✦"
                  className="cb-input"
                />
                {/* character count */}
                <p className="text-right text-[0.7rem] text-gray-300 mt-1">
                  {formData.content.length} characters
                  {formData.content.length > 0 && ` · ~${Math.ceil(formData.content.split(" ").length / 200)} min read`}
                </p>
              </div>

              {/* ── TAGS ── */}
              <div>
                <div className="field-header">
                  <label className="cb-label" style={{ marginBottom: 0 }}>
                    Tags <span className="text-gray-300">(comma separated)</span>
                  </label>
                  <AIBtn
                    onClick={handleAutoTags}
                    loading={aiLoading.tags}
                    label="Auto-Generate Tags"
                  />
                </div>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="React, JavaScript, MongoDB — or let AI suggest ✦"
                  className="cb-input"
                />
                {tagList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tagList.map((t, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-500 text-[0.7rem] px-3 py-1 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Author + Submit */}
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