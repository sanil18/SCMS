/**
 * SCMS — Secure Cooperative Management System
 * Express REST API with JWT auth, bcrypt password hashing, Helmet,
 * rate limiting, CORS, request logging, RBAC and immutable audit logs.
 *
 * This is a demo backend. In production, replace the in-memory store with
 * PostgreSQL + Prisma/Knex, move secrets into a vault, and terminate TLS
 * at a reverse proxy (nginx / CloudFront).
 */
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";

import { USERS } from "./data/seed.js";
import authRoutes from "./routes/auth.js";
import memberRoutes from "./routes/members.js";
import loanRoutes from "./routes/loans.js";
import savingsRoutes from "./routes/savings.js";
import transactionRoutes from "./routes/transactions.js";
import anomalyRoutes from "./routes/anomalies.js";
import auditRoutes from "./routes/audit.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ---- Security middleware ---------------------------------------------------
app.use(helmet());                          // sets hardened HTTP headers
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "100kb" }));  // reject oversized payloads
app.use(morgan("dev"));                     // request logging

// Global rate limit — 100 requests / minute / IP
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Rate limit exceeded. Please slow down." },
  })
);

// ---- Password hashing (bcrypt) on boot -------------------------------------
// Hash each seed user's plaintext password at startup so passwords are never
// stored in plaintext at runtime. In production this would be done once at
// registration and persisted to the database.
for (const u of USERS) {
  u.passwordHash = bcrypt.hashSync(u.plain, 10);
  delete u.plain;
}

// ---- Health & meta ---------------------------------------------------------
app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    service: "scms-api",
    version: "1.0.0",
    time: new Date().toISOString(),
  })
);

// ---- Routes ----------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/anomalies", anomalyRoutes);
app.use("/api/audit", auditRoutes);

// 404
app.use((req, res) =>
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}` })
);

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error("[SCMS]", err);
  res.status(err.status || 500).json({ error: err.message || "Internal error" });
});

app.listen(PORT, () => {
  console.log(`\n🛡️  SCMS API listening on http://localhost:${PORT}`);
  console.log("    GET  /api/health");
  console.log("    POST /api/auth/login       { username, password }");
  console.log("    POST /api/auth/verify-otp  { ticket, otp }");
  console.log("    GET  /api/members          (Bearer token)");
  console.log("    GET  /api/transactions");
  console.log("    GET  /api/anomalies        (admin | accountant)");
  console.log("    GET  /api/audit            (admin)\n");
});
