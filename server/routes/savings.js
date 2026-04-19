import { Router } from "express";
import { MEMBERS, TRANSACTIONS } from "../data/seed.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { audit } from "../middleware/audit.js";

const router = Router();
router.use(requireAuth);

// Overview — totals and per-member balances
router.get("/", (req, res) => {
  const scope =
    req.user.role === "member"
      ? MEMBERS.filter((m) => m.name === req.user.name)
      : MEMBERS;

  const total = scope.reduce((a, m) => a + m.savings, 0);
  const avg = scope.length ? Math.round(total / scope.length) : 0;

  res.json({
    totalBalance: total,
    averageBalance: avg,
    accounts: scope.map((m) => ({
      id: m.id,
      member: m.name,
      opened: m.joined,
      balance: m.savings,
    })),
  });
});

// Post a deposit or withdrawal (admin + accountant)
router.post("/:id/transaction", requireRole("admin", "accountant"), (req, res) => {
  const { type, amount, channel = "Branch" } = req.body || {};
  if (!["Deposit", "Withdrawal"].includes(type)) {
    return res.status(400).json({ error: "type must be Deposit or Withdrawal" });
  }
  if (!amount || amount <= 0) return res.status(400).json({ error: "amount must be > 0" });

  const member = MEMBERS.find((m) => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: "Member not found" });

  if (type === "Deposit") member.savings += amount;
  else {
    if (member.savings < amount) return res.status(400).json({ error: "Insufficient balance" });
    member.savings -= amount;
  }

  const txn = {
    id: `T-${5000 + TRANSACTIONS.length + 1}`,
    date: new Date().toISOString().replace("T", " ").slice(0, 16),
    member: member.name,
    type,
    amount,
    channel,
  };
  TRANSACTIONS.push(txn);
  audit({ actor: req.user.username, action: "POST_TRANSACTION", target: txn.id, ip: req.ip });

  res.status(201).json({ transaction: txn, balance: member.savings });
});

export default router;
