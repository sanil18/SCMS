import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { USERS } from "../data/seed.js";
import { signToken } from "../middleware/auth.js";
import { audit } from "../middleware/audit.js";

const router = Router();

// Stricter rate limit on auth endpoints to mitigate brute-force attacks
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again in a minute." },
});

router.use(authLimiter);

// Step 1: username + password → returns a short-lived "mfa ticket"
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const user = USERS.find((u) => u.username === username);
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!ok) {
    audit({ actor: username || "unknown", action: "LOGIN_FAILED", target: username, ip: req.ip, status: "alert" });
    return res.status(401).json({ error: "Invalid credentials" });
  }

  audit({ actor: user.username, action: "LOGIN_STEP1_OK", target: user.username, ip: req.ip });
  return res.json({
    mfaRequired: true,
    ticket: user.id, // in real systems this would be a signed short-lived token
    message: "Enter the 6-digit OTP from your authenticator app",
  });
});

// Step 2: verify OTP → issue JWT
router.post("/verify-otp", (req, res) => {
  const { ticket, otp } = req.body || {};
  const user = USERS.find((u) => u.id === ticket);
  if (!user) return res.status(400).json({ error: "Invalid or expired ticket" });

  if (user.otp !== otp) {
    audit({ actor: user.username, action: "OTP_FAILED", target: user.username, ip: req.ip, status: "alert" });
    return res.status(401).json({ error: "Invalid OTP code" });
  }

  const token = signToken(user);
  audit({ actor: user.username, action: "LOGIN_SUCCESS", target: user.username, ip: req.ip });

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export default router;
