import { Router } from "express";
import { LOANS } from "../data/seed.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { audit } from "../middleware/audit.js";

const router = Router();
router.use(requireAuth);

// List loans — members only see their own
router.get("/", (req, res) => {
  if (req.user.role === "member") {
    return res.json(LOANS.filter((l) => l.member === req.user.name));
  }
  res.json(LOANS);
});

// Apply for a new loan (any authenticated user)
router.post("/", (req, res) => {
  const { amount, rate = 12, term = 12, member } = req.body || {};
  if (!amount || amount <= 0) return res.status(400).json({ error: "amount is required" });

  const owner = req.user.role === "member" ? req.user.name : member || req.user.name;
  const loan = {
    id: `L-${9000 + LOANS.length + 1}`,
    member: owner,
    amount,
    rate,
    term,
    status: "Pending",
    nextDue: "-",
    balance: amount,
  };
  LOANS.push(loan);
  audit({ actor: req.user.username, action: "LOAN_APPLIED", target: loan.id, ip: req.ip });
  res.status(201).json(loan);
});

// Approve / reject loan (admin + accountant)
router.post("/:id/approve", requireRole("admin", "accountant"), (req, res) => {
  const loan = LOANS.find((l) => l.id === req.params.id);
  if (!loan) return res.status(404).json({ error: "Loan not found" });
  loan.status = "Active";
  loan.nextDue = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
  audit({ actor: req.user.username, action: "APPROVE_LOAN", target: loan.id, ip: req.ip });
  res.json(loan);
});

export default router;
