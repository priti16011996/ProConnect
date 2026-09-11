import jwt from "jsonwebtoken";

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    let validToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!validToken) {
      return res.status(403).json({ message: "Unautherised token" });
    }
    req.userId = validToken.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authenticateToken;
