import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic2, Pause, Square, Heart, Bookmark, BookmarkCheck } from "lucide-react";
import api from "../utils/api";

const API = import.meta.env.VITE_API_URL;

export default function BlogDetailModal({ blog, onClose }) {
  const [viewedBlog, setViewedBlog]       = useState(blog);
  const [showComments, setShowComments]   = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [commentText, setCommentText]     = useState("");
  const user    = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // ── Like & Bookmark state ──────────────────────────────────────────────────
  const userId       = user?._id || user?.id;
  const [liked,      setLiked]      = useState(blog?.likedBy?.includes(userId));
  const [likeCount,  setLikeCount]  = useState(blog?.likes || 0);
  const [bookmarked, setBookmarked] = useState(blog?.bookmarkedBy?.includes(userId));
  const [likeLoading, setLikeLoading]     = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // ── TTS ───────────────────────────────────────────────────────────────────
  const [ttsState, setTtsState] = useState("idle");
  const uttRef = useRef(null);

  useEffect(() => {
    if (blog?._id)
      fetch(`${API}/api/blogs/${blog._id}/view`, { method: "POST" });
    return () => window.speechSynthesis.cancel();
  }, [blog]);

  if (!blog) return null;

  // ── TTS helpers ───────────────────────────────────────────────────────────
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
    if (ttsState === "playing") { window.speechSynthesis.pause(); setTtsState("paused"); return; }
    if (ttsState === "paused")  { window.speechSynthesis.resume(); setTtsState("playing"); return; }
    window.speechSynthesis.cancel();
    const text = `${viewedBlog.title}. ${viewedBlog.excerpt}. ${viewedBlog.content}`;
    const utt  = new SpeechSynthesisUtterance(text);
    utt.rate   = 1; utt.pitch = 1;
    setTimeout(() => { utt.voice = getBestVoice(); }, 100);
    utt.onend  = () => setTtsState("idle");
    utt.onerror = () => setTtsState("idle");
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
    setTtsState("playing");
  }

  function handleStop() { window.speechSynthesis.cancel(); setTtsState("idle"); }

  // ── Like handler ──────────────────────────────────────────────────────────
  async function handleLike() {
    if (!userId) { navigate("/login"); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      // const res  = await fetch(`${API}/api/blogs/${viewedBlog._id}/like`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId }),
      // });
      // const data = await res.json();
      const data = await api.post(`/api/blogs/${viewedBlog._id}/like`, {});

      if (data.status === "Success") {
        setLiked(data.liked);
        setLikeCount(data.likes);
      }
    } catch (err) { console.error(err); }
    finally { setLikeLoading(false); }
  }

  // ── Bookmark handler ──────────────────────────────────────────────────────
  async function handleBookmark() {
    if (!userId) { navigate("/login"); return; }
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      // const res  = await fetch(`${API}/api/blogs/${viewedBlog._id}/bookmark`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId }),
      // });
      // const data = await res.json();
      const data = await api.post(`/api/blogs/${viewedBlog._id}/bookmark`, {});

      if (data.status === "Success") setBookmarked(data.bookmarked);
    } catch (err) { console.error(err); }
    finally { setBookmarkLoading(false); }
  }

  // ── Add comment ───────────────────────────────────────────────────────────
  async function handleAddComment() {
    try {
      // const res  = await fetch(`${API}/api/blogs/${viewedBlog._id}/comments`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ text: commentText, author: { name: user.name, _id: userId } }),
      // });
      // const data = await res.json();
      const data = await api.post(`/api/blogs/${viewedBlog._id}/comments`, { text: commentText });

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

  const readTime = Math.ceil((viewedBlog.content?.split(" ").length || 0) / 200) || 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .bd-font  { font-family:'DM Sans',sans-serif; }
        .bd-serif { font-family:'Lora',serif; }

        @keyframes likePop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        .like-pop { animation: likePop 0.3s ease; }
      `}</style>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bd-font relative bg-white w-[90%] md:w-[55%] max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl z-50">

          {/* ── Sticky top bar ── */}
          <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 z-10 px-7 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Listen btn */}
              <button onClick={handleListen}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition
                  ${ttsState === "playing"
                    ? "bg-[#e94560] text-white"
                    : "bg-[#1a1a2e] text-white hover:bg-[#e94560]"}`}>
                {ttsState === "playing"
                  ? <><Pause size={11}/> Pause</>
                  : ttsState === "paused"
                  ? <><Mic2 size={11}/> Resume</>
                  : <><Mic2 size={11}/> Listen</>}
              </button>
              {ttsState !== "idle" && (
                <button onClick={handleStop}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 border border-gray-200 px-2.5 py-1.5 rounded-lg transition">
                  <Square size={9} fill="currentColor"/> Stop
                </button>
              )}
              <span className="text-gray-300 text-xs">{readTime} min read</span>
            </div>

            {/* ── Like + Bookmark + Close ── */}
            <div className="flex items-center gap-2">

              {/* Like */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition
                  ${liked
                    ? "bg-red-50 border-red-200 text-[#e94560]"
                    : "bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-[#e94560]"}`}
              >
                <Heart
                  size={13}
                  fill={liked ? "#e94560" : "none"}
                  className={liked ? "like-pop" : ""}
                  style={{ color: liked ? "#e94560" : "currentColor" }}
                />
                {likeCount > 0 ? likeCount : "Like"}
              </button>

              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition
                  ${bookmarked
                    ? "bg-blue-50 border-blue-200 text-blue-500"
                    : "bg-white border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-500"}`}
              >
                {bookmarked
                  ? <BookmarkCheck size={13} className="text-blue-500"/>
                  : <Bookmark size={13}/>}
                {bookmarked ? "Saved" : "Save"}
              </button>

              {/* Close */}
              <button onClick={() => { handleStop(); onClose(); }}
                className="ml-1 text-gray-300 hover:text-gray-600 transition text-lg leading-none">✕</button>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="px-7 pt-6 pb-8">

            <h1 className="bd-serif text-2xl md:text-[1.7rem] font-semibold text-[#1a1a2e] mb-4 leading-tight">
              {viewedBlog.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
              <div className="w-7 h-7 rounded-full bg-[#1a1a2e] text-white text-[10px] font-bold flex items-center justify-center">
                {viewedBlog.author?.name?.slice(0,2).toUpperCase() ?? "AB"}
              </div>
              <span className="font-medium text-[#1a1a2e]">{viewedBlog.author?.name}</span>
              <span>·</span>
              <span>{new Date(viewedBlog.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span>
            </div>

            <p className="text-gray-500 italic text-sm leading-relaxed border-l-4 border-[#e94560]/30 pl-4 bg-red-50/40 py-2.5 rounded-r-xl mb-6">
              {viewedBlog.excerpt}
            </p>

            <div className="text-gray-700 leading-relaxed text-[0.92rem] mb-6 whitespace-pre-line">
              {viewedBlog.content}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(viewedBlog.tags || []).map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>

            {/* ── Bottom action bar ── */}
            <div className="flex items-center gap-3 py-4 border-t border-b border-gray-100 mb-6">
              <button onClick={handleLike} disabled={likeLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition
                  ${liked ? "bg-red-50 border-red-200 text-[#e94560]" : "bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-[#e94560]"}`}>
                <Heart size={15} fill={liked ? "#e94560" : "none"} style={{color: liked ? "#e94560" : "currentColor"}}/>
                {liked ? "Liked" : "Like"} {likeCount > 0 && `· ${likeCount}`}
              </button>

              <button onClick={handleBookmark} disabled={bookmarkLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition
                  ${bookmarked ? "bg-blue-50 border-blue-200 text-blue-500" : "bg-white border-gray-200 text-gray-500 hover:border-blue-200 hover:text-blue-500"}`}>
                {bookmarked ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>}
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>

            {/* Comments */}
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => handleProtectedAction(() => setShowComments(!showComments))}
                className="bg-[#1a1a2e] hover:bg-[#16213e] text-white px-5 py-2 rounded-lg text-sm transition">
                {showComments ? "Hide Comments" : `💬 Comments (${viewedBlog.comments?.length || 0})`}
              </button>
              <button onClick={() => handleProtectedAction(() => setShowAddComment(!showAddComment))}
                className="bg-[#e94560] hover:bg-[#d13a52] text-white px-5 py-2 rounded-lg text-sm transition">
                {showAddComment ? "Cancel" : "+ Add Comment"}
              </button>
            </div>

            {showAddComment && (
              <div className="mt-4 flex gap-3">
                <input type="text" placeholder="Write a comment..."
                  value={commentText} onChange={e => setCommentText(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#e94560] transition"/>
                <button onClick={handleAddComment}
                  className="bg-[#e94560] hover:bg-[#d13a52] text-white px-5 py-2 rounded-lg text-sm transition">Post</button>
              </div>
            )}

            {showComments && (
              <div className="mt-5 space-y-3">
                {(viewedBlog.comments || []).length === 0
                  ? <p className="text-gray-400 text-sm text-center py-4">No comments yet.</p>
                  : viewedBlog.comments.map((c, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
                      <p className="text-xs font-semibold text-[#1a1a2e] mb-1">{c.author?.name || c.user}</p>
                      <p className="text-sm text-gray-600">{c.text}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}