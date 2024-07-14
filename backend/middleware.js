const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired" });
    } else {
      return res.status(403).json({ message: "Authentication error" });
    }
  }
};

module.exports = authMiddleware;
