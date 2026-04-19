import { Router } from "express";
import { TRANSACTIONS } from "../data/seed.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { annotate } from "../services/anomaly.js";

const router = Router();
router.use(requireAuth, requireRole("admin", "accountant"));

// Return only flagged transactions with reasons and summary stats
router.get("/", (_req, res) => {
  const annotated = annotate(TRANSACTIONS);
  const flagged = annotated.filter((t) => t.flagged);

  res.json({
    total: annotated.length,
    flaggedCount: flagged.length,
    detectionRate: annotated.length
      ? +((flagged.length / annotated.length) * 100).toFixed(1)
      : 0,
    rules: [
      { id: "R1", name: "Off-hours high-value transfer (22:00–06:00, > NPR 100k)" },
      { id: "R2", name: "Spike vs 30-day rolling average (> 10×)" },
      { id: "R3", name: "Velocity: > 5 transactions in 1 minute" },
    ],
    flagged,
  });
});

export default router;
