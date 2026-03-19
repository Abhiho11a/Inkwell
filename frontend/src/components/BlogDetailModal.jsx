import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic2, Pause, Square } from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function BlogDetailModal({ blog, onClose }) {
  const [viewedBlog, setViewedBlog] = useState(blog);
  const [showComments, setShowComments] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // TTS
  const [ttsState, setTtsState] = useState("idle"); // idle | playing | paused
  const uttRef = useRef(null);

  useEffect(() => {
    if (blog?._id)
      fetch(`${API}/api/blogs/${blog._id}/view`, { method: "POST" });
    return () => window.speechSynthesis.cancel(); // cleanup on close
  }, [blog]);

  if (!blog) return null;

  // ── pick a nice English voice ──────────────────────────────────────────────
  function getBestVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.name === "Google UK English Female") ||
      voices.find(v => v.lang === "en-GB") ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0]
    );
  }

  function handleListen() {
    if (ttsState === "playing") {
      window.speechSynthesis.pause();
      setTtsState("paused");
      return;
    }
    if (ttsState === "paused") {
      window.speechSynthesis.resume();
      setTtsState("playing");
      return;
    }
    // fresh start
    window.speechSynthesis.cancel();
    const text = `${viewedBlog.title}. ${viewedBlog.excerpt}. ${viewedBlog.content}`;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1;
    utt.pitch = 1;
    setTimeout(() => { utt.voice = getBestVoice(); }, 100);
    utt.onend = () => setTtsState("idle");
    utt.onerror = () => setTtsState("idle");
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
    setTtsState("playing");
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    setTtsState("idle");
  }

  // ── comments ──────────────────────────────────────────────────────────────
  async function handleAddComment() {
    try {
      const res = await fetch(`${API}/api/blogs/${viewedBlog._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText, author: { name: user.name, _id: user.id } }),
      });
      const data = await res.json();
      if (data.status === "Success") {
        alert("Comment posted");
        setCommentText(""); setShowAddComment(false);
        setViewedBlog(data.updatedBlog);
      }
    } catch (err) { console.error(err); }
  }

  const handleProtectedAction = (action) => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    action();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">

        {/* Modal */}
        <div className="relative bg-white w-[90%] md:w-1/2 max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-8 z-50">

          {/* Close */}
          <button onClick={() => { handleStop(); onClose(); }}
            className="absolute top-5 right-5 text-gray-500 hover:text-black text-2xl transition">
            ✕
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {viewedBlog.title}
          </h1>

          {/* Author + Date + Listen button */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By {viewedBlog.author.name}</span>
              <span>· {new Date(viewedBlog.createdAt).toLocaleDateString()}</span>
            </div>

            {/* TTS controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleListen}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition
                  ${ttsState === "playing"
                    ? "bg-[#e94560] text-white"
                    : "bg-[#1a1a2e] text-white hover:bg-[#e94560]"}`}
              >
                {ttsState === "playing"
                  ? <><Pause size={14} /> Pause</>
                  : ttsState === "paused"
                  ? <><Mic2 size={14} /> Resume</>
                  : <><Mic2 size={14} /> Listen</>}
              </button>

              {ttsState !== "idle" && (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300 px-3 py-2 rounded-xl transition"
                >
                  <Square size={11} fill="currentColor" /> Stop
                </button>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-gray-600 italic mb-6 border-l-4 border-[#e94560]/30 pl-4">
            {viewedBlog.excerpt}
          </p>

          {/* Content */}
          <div className="text-gray-700 leading-relaxed space-y-4 mb-6">
            <p>{viewedBlog.content}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(viewedBlog.tags || []).map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* Comment buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleProtectedAction(() => setShowComments(!showComments))}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition text-sm"
            >
              {showComments ? "Hide Comments" : `💬 Comments (${viewedBlog.comments?.length || 0})`}
            </button>
            <button
              onClick={() => handleProtectedAction(() => setShowAddComment(!showAddComment))}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition text-sm"
            >
              {showAddComment ? "Cancel" : "+ Add Comment"}
            </button>
          </div>

          {/* Add comment input */}
          {showAddComment && (
            <div className="mt-4 flex gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
              <button onClick={handleAddComment}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm transition">
                Post
              </button>
            </div>
          )}

          {/* Comments list */}
          {showComments && (
            <div className="mt-6 border-t pt-6 space-y-4">
              {(viewedBlog.comments || []).length === 0
                ? <p className="text-gray-400 text-sm text-center py-4">No comments yet.</p>
                : viewedBlog.comments.map((c, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-sm text-gray-800">{c.author?.name || c.user}</p>
                    <p className="text-gray-600 text-sm mt-1">{c.text}</p>
                  </div>
                ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}