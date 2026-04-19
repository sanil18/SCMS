import { Router } from "express";
import { TRANSACTIONS } from "../data/seed.js";
import { requireAuth } from "../middleware/auth.js";
import { annotate } from "../services/anomaly.js";

const router = Router();
router.use(requireAuth);

// List transactions — with anomaly flags attached on the fly
router.get("/", (req, res) => {
  const { type, flagged } = req.query;

  let rows = annotate(TRANSACTIONS);

  if (req.user.role === "member") {
    rows = rows.filter((t) => t.member === req.user.name);
  }
  if (type) rows = rows.filter((t) => t.type.toLowerCase() === String(type).toLowerCase());
  if (flagged === "true") rows = rows.filter((t) => t.flagged);

  res.json(rows);
});

export default router;
