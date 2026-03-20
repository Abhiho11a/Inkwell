const jwt = require("jsonwebtoken")
// ── Sign a token ──────────────────────────────
function signToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ── Protect middleware (must be logged in) ────
function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Fail",
        message: "You are not logged in. Please login to continue."
      });
    }
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId    = decoded.id; // ← now every protected route has req.userId
    next();
  } catch (err) {
    return res.status(401).json({
      status: "Fail",
      message: "Invalid or expired token. Please login again."
    });
  }
}

// ── Author-only middleware (edit/delete) ──────
async function restrictToAuthor(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ status: "Fail", message: "Blog not found" });
    }
    if (blog.author._id.toString() !== req.userId.toString()) {
      return res.status(403).json({
        status: "Fail",
        message: "You are not allowed to perform this action."
      });
    }
    req.blog = blog; // attach so you don't fetch again
    next();
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
}

module.exports = {signToken,protect,restrictToAuthor}