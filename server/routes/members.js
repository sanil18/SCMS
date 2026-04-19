import { Router } from "express";
import { MEMBERS } from "../data/seed.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { audit } from "../middleware/audit.js";

const router = Router();
router.use(requireAuth);

// List members — admins & accountants see all, members see only themselves
router.get("/", (req, res) => {
  if (req.user.role === "member") {
    return res.json(MEMBERS.filter((m) => m.name === req.user.name));
  }
  res.json(MEMBERS);
});

// Get one member
router.get("/:id", (req, res) => {
  const m = MEMBERS.find((x) => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Member not found" });
  if (req.user.role === "member" && m.name !== req.user.name) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.json(m);
});

// Create a new member (admin only)
router.post("/", requireRole("admin"), (req, res) => {
  const { name, email, phone } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });

  const nextNum = 1001 + MEMBERS.length;
  const member = {
    id: `M-${nextNum}`,
    name,
    email,
    phone: phone || "",
    joined: new Date().toISOString().slice(0, 10),
    kyc: "Pending",
    status: "Active",
    savings: 0,
    loans: 0,
  };
  MEMBERS.push(member);
  audit({ actor: req.user.username, action: "CREATE_MEMBER", target: member.id, ip: req.ip });
  res.status(201).json(member);
});

// Update member (admin only)
router.patch("/:id", requireRole("admin"), (req, res) => {
  const m = MEMBERS.find((x) => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Member not found" });
  Object.assign(m, req.body || {});
  audit({ actor: req.user.username, action: "UPDATE_MEMBER", target: m.id, ip: req.ip });
  res.json(m);
});

export default router;
