import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "scms-demo-secret-change-in-prod";
export const JWT_EXPIRES_IN = "2h";

// Issue a signed JWT for the given user
export function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify Bearer token and attach `req.user`
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing Authorization header" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Role-based access control — pass allowed roles
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden — insufficient role" });
    }
    next();
  };
}
