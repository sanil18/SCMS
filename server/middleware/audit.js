import { AUDIT_LOGS } from "../data/seed.js";

let counter = AUDIT_LOGS.length;

// Append an immutable audit log entry
export function audit({ actor, action, target, ip, status = "success" }) {
  counter += 1;
  const entry = {
    id: `A-${counter}`,
    ts: new Date().toISOString().replace("T", " ").slice(0, 19),
    actor: actor || "unknown",
    action,
    target: target || "-",
    ip: ip || "-",
    status,
  };
  AUDIT_LOGS.unshift(entry); // newest first
  return entry;
}

// Express middleware — logs authenticated mutating requests automatically
export function auditRequest(action) {
  return (req, _res, next) => {
    audit({
      actor: req.user?.username,
      action,
      target: req.params.id || req.body?.id || "-",
      ip: req.ip,
    });
    next();
  };
}
