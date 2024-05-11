const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ ok: false, message: "Token is required" });
  }
  jwt.verify(token, process.env.BCRYPT_PASSWORD_STRING, (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
}
module.exports = verifyToken;