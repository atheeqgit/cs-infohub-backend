import jwt from "jsonwebtoken";
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "thisIsTheScrectForThisDataBase");
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid Token" });
  }
};
