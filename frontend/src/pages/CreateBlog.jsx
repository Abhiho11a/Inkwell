import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, Wand2, Tag, FileText, RefreshCw, X, Check, ChevronDown } from "lucide-react";
import api from "../utils/api";

const API = import.meta.env.VITE_API_URL;

export default function CreateBlog() {
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({ title: "", excerpt: "", content: "", tags: "" });
  const [loading, setLoading] = useState(false);

  // AI state
  const [aiLoading, setAiLoading] = useState({});
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [improveTarget, setImproveTarget] = useState(null); // "excerpt" or sentence
  const [improvedText, setImprovedText] = useState("");
  const [showImprovePopup, setShowImprovePopup] = useState(false);
  const [selectedTone, setSelectedTone] = useState("engaging");
  const [showToneDropdown, setShowToneDropdown] = useState(false);

  const tones = ["engaging", "professional", "casual", "persuasive", "informative"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // close popups on edit
    if (e.target.name === "title") setShowTitleSuggestions(false);
  };

  // ── AI Handlers ──

  const aiContinue = async () => {
    if (!formData.content.trim()) return alert("Write some content first!");
    setAiLoading((p) => ({ ...p, continue: true }));
    try {
      const res = await fetch(`${API}/api/ai/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: formData.content }),
      });
      const data = await res.json();
      if (data.status === "Success") {
        setFormData((p) => ({ ...p, content: p.content + " " + data.data }));
      }
    } catch (e) { console.error(e); }
    finally { setAiLoading((p) => ({ ...p, continue: false })); }
  };

  const aiSummarize = async () => {
    if (!formData.content.trim()) return alert("Write some content first!");
    setAiLoading((p) => ({ ...p, summarize: true }));
    try {
      const res = await fetch(`${API}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: formData.content }),
      });
      const data = await res.json();
      if (data.status === "Success") setFormData((p) => ({ ...p, excerpt: data.data }));
    } catch (e) { console.error(e); }
    finally { setAiLoading((p) => ({ ...p, summarize: false })); }
  };

  const aiTitles = async () => {
    if (!formData.content.trim()) return alert("Write some content first!");
    setAiLoading((p) => ({ ...p, titles: true }));
    try {
      const res = await fetch(`${API}/api/ai/titles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: formData.content }),
      });
      const data = await res.json();
      if (data.status === "Success") { setTitleSuggestions(data.data); setShowTitleSuggestions(true); }
    } catch (e) { console.error(e); }
    finally { setAiLoading((p) => ({ ...p, titles: false })); }
  };

  const aiTags = async () => {
    if (!formData.content.trim()) return alert("Write some content first!");
    setAiLoading((p) => ({ ...p, tags: true }));
    try {
      const res = await fetch(`${API}/api/ai/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: formData.content }),
      });
      const data = await res.json();
      if (data.status === "Success") setFormData((p) => ({ ...p, tags: data.data.join(", ") }));
    } catch (e) { console.error(e); }
    finally { setAiLoading((p) => ({ ...p, tags: false })); }
  };

  const aiImprove = async (field) => {
    const text = formData[field];
    if (!text.trim()) return alert(`Write some ${field} first!`);
    setImproveTarget(field);
    setAiLoading((p) => ({ ...p, [`improve_${field}`]: true }));
    try {
      const res = await fetch(`${API}/api/ai/improve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sentence: text, tone: selectedTone }),
      });
      const data = await res.json();
      if (data.status === "Success") { setImprovedText(data.data); setShowImprovePopup(true); }
    } catch (e) { console.error(e); }
    finally { setAiLoading((p) => ({ ...p, [`improve_${field}`]: false })); }
  };

  const acceptImproved = () => {
    setFormData((p) => ({ ...p, [improveTarget]: improvedText }));
    setShowImprovePopup(false);
    setImprovedText("");
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newBlog = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: { name: user?.name, _id: user?.id },
      createdAt: new Date().toISOString(),
      tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      comments: [],
    };
    try {
      // const response = await fetch(`${API}/api/blogs`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ newBlog, userId: user?.id }),
      // });
      // const data = await response.json();
      const data = await api.post("/api/blogs", { newBlog });

      if (data.status === "Success") { alert(data.message); navigate("/myblog"); }
      else alert(data.message);
    } catch (error) { console.error("Blog creation failed:", error); }
    finally { setLoading(false); }
  };

  // ── Spinner ──
  const Spinner = () => (
    <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  );

  // ── AI Button ──
  const AIBtn = ({ onClick, loading, icon: Icon, label, color = "pink" }) => {
    const colors = {
      pink: "bg-pink-50 text-pink-500 hover:bg-pink-100 border-pink-200",
      purple: "bg-purple-50 text-purple-500 hover:bg-purple-100 border-purple-200",
      blue: "bg-blue-50 text-blue-500 hover:bg-blue-100 border-blue-200",
      green: "bg-green-50 text-green-500 hover:bg-green-100 border-green-200",
    };
    return (
      <button type="button" onClick={onClick} disabled={loading}
        className={`flex items-center gap-1.5 text-[0.7rem] font-medium px-2.5 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${colors[color]}`}>
        {loading ? <Spinner /> : <Icon size={11} />}
        {label}
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .cb-font  { font-family: 'DM Sans', sans-serif; }
        .cb-serif { font-family: 'Lora', serif; }
        .cb-input {
          width: 100%; background: #f8f7f4; border: 1.5px solid #e5e3de;
          border-radius: 10px; padding: 12px 16px; font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif; color: #1a1a2e; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; resize: none;
        }
        .cb-input::placeholder { color: #aaa; }
        .cb-input:focus { border-color: #e94560; box-shadow: 0 0 0 3px rgba(233,69,96,0.08); background: #fff; }
        .cb-label { display: block; font-size: 0.8rem; font-weight: 500; color: #6b7280;
          letter-spacing: 0.4px; margin-bottom: 7px; font-family: 'DM Sans', sans-serif; }
        .ai-badge { background: linear-gradient(135deg, #e94560, #a855f7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .fade-slide { animation: fadeSlide 0.2s ease; }
      `}</style>

      <div className="cb-font min-h-screen bg-[#f8f7f4]">

        {/* Navbar */}
        <nav className="bg-[#1a1a2e] sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-6 h-[60px] flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="cb-serif text-white text-xl font-semibold tracking-tight">Create Blog</h1>
            <div className="w-16" />
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="mb-8">
            <span className="inline-block bg-[#1a1a2e] text-[#e94560] text-[0.7rem] font-medium tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4">New Post</span>
            <h2 className="cb-serif text-[#1a1a2e] text-4xl font-semibold tracking-tight leading-tight">
              Write Something<br /><em className="not-italic text-[#e94560]">Amazing</em>
            </h2>
            <p className="text-gray-400 text-sm mt-2">Fill in the details below and hit publish when you're ready.</p>
          </div>

          {/* AI Improve Popup */}
          {showImprovePopup && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full fade-slide">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wand2 size={15} className="text-purple-500" />
                    <span className="text-sm font-semibold text-[#1a1a2e]">AI Improved Version</span>
                  </div>
                  <button onClick={() => setShowImprovePopup(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed mb-4">
                  {improvedText}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowImprovePopup(false)} type="button"
                    className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition">
                    Discard
                  </button>
                  <button onClick={acceptImproved} type="button"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs bg-[#e94560] text-white rounded-lg hover:bg-[#d13a52] transition font-medium">
                    <Check size={11} /> Use This
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="cb-label mb-0">Blog Title</label>
                  <AIBtn onClick={aiTitles} loading={aiLoading.titles} icon={Sparkles} label="Suggest Titles" color="pink" />
                </div>
                <input type="text" name="title" required value={formData.title} onChange={handleChange}
                  placeholder="Enter a catchy title..." className="cb-input" />

                {/* Title Suggestions Dropdown */}
                {showTitleSuggestions && titleSuggestions.length > 0 && (
                  <div className="mt-2 bg-white border border-pink-100 rounded-xl shadow-lg overflow-hidden fade-slide">
                    <div className="flex items-center justify-between px-4 py-2 bg-pink-50 border-b border-pink-100">
                      <span className="text-[0.7rem] font-semibold text-pink-500 flex items-center gap-1"><Sparkles size={10}/> AI Title Suggestions</span>
                      <button type="button" onClick={() => setShowTitleSuggestions(false)} className="text-pink-300 hover:text-pink-500"><X size={13}/></button>
                    </div>
                    {titleSuggestions.map((t, i) => (
                      <button key={i} type="button"
                        onClick={() => { setFormData((p) => ({ ...p, title: t })); setShowTitleSuggestions(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 transition border-b border-gray-50 last:border-0">
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="cb-label mb-0">Excerpt</label>
                  <div className="flex gap-1.5">
                    <AIBtn onClick={aiSummarize} loading={aiLoading.summarize} icon={FileText} label="Auto-Generate" color="blue" />
                    <AIBtn onClick={() => aiImprove("excerpt")} loading={aiLoading.improve_excerpt} icon={Wand2} label="Improve" color="purple" />
                  </div>
                </div>
                <textarea name="excerpt" required rows="3" value={formData.excerpt} onChange={handleChange}
                  placeholder="Short summary of your blog..." className="cb-input" />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="cb-label mb-0">Content</label>
                  <div className="flex items-center gap-1.5">
                    {/* Tone Selector */}
                    <div className="relative">
                      <button type="button" onClick={() => setShowToneDropdown(!showToneDropdown)}
                        className="flex items-center gap-1 text-[0.7rem] text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1.5 rounded-lg transition">
                        Tone: <span className="text-gray-600 font-medium capitalize">{selectedTone}</span>
                        <ChevronDown size={10}/>
                      </button>
                      {showToneDropdown && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden w-36 fade-slide">
                          {tones.map(t => (
                            <button key={t} type="button" onClick={() => { setSelectedTone(t); setShowToneDropdown(false); }}
                              className={`w-full text-left px-3 py-2 text-xs capitalize transition ${selectedTone === t ? "bg-purple-50 text-purple-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <AIBtn onClick={() => aiImprove("content")} loading={aiLoading.improve_content} icon={Wand2} label="Improve" color="purple" />
                    <AIBtn onClick={aiContinue} loading={aiLoading.continue} icon={RefreshCw} label="Continue Writing" color="green" />
                  </div>
                </div>
                <textarea name="content" required rows="9" value={formData.content} onChange={handleChange}
                  placeholder="Write your full blog content here..." className="cb-input" />
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="cb-label mb-0">Tags <span className="text-gray-300">(comma separated)</span></label>
                  <AIBtn onClick={aiTags} loading={aiLoading.tags} icon={Tag} label="Generate Tags" color="blue" />
                </div>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                  placeholder="React, JavaScript, MongoDB" className="cb-input" />
                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.split(",").map((t, i) =>
                      t.trim() ? (
                        <span key={i} className="bg-gray-100 text-gray-500 text-[0.7rem] px-3 py-1 rounded-full">#{t.trim()}</span>
                      ) : null
                    )}
                  </div>
                )}
              </div>

              {/* AI Features hint */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <Sparkles size={14} className="text-pink-400 shrink-0" />
                <p className="text-[0.72rem] text-gray-500 leading-relaxed">
                  <span className="font-semibold ai-badge">AI Assistant</span> — Use the buttons above to auto-generate excerpts, suggest titles, continue writing, improve tone, or generate tags.
                </p>
              </div>

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
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d13a52] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
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