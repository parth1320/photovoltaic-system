const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  const extratedToken = token.replace("Bearer ", "");

  if (!extratedToken) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(extratedToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token!" });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;
