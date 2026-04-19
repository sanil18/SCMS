import { Router } from "express";
import { AUDIT_LOGS } from "../data/seed.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

// Return the immutable audit log (newest first)
router.get("/", (_req, res) => {
  res.json({
    total: AUDIT_LOGS.length,
    alerts: AUDIT_LOGS.filter((a) => a.status === "alert").length,
    entries: AUDIT_LOGS,
  });
});

export default router;
