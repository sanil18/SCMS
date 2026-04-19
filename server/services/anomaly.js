// Rule-based anomaly detection engine for SCMS transactions.
// Returns { flagged: boolean, reasons: string[] } for each transaction.

const OFF_HOURS_START = 22; // 10 PM
const OFF_HOURS_END = 6;    // 6 AM
const OFF_HOURS_HIGH_VALUE = 100_000; // NPR
const SPIKE_MULTIPLIER = 10;
const VELOCITY_WINDOW_MIN = 1;
const VELOCITY_LIMIT = 5;

function hourOf(dateStr) {
  // "2026-04-18 23:58" -> 23
  const [, time] = dateStr.split(" ");
  return parseInt((time || "00").split(":")[0], 10);
}

function memberAverage(txns, member) {
  const amounts = txns.filter((t) => t.member === member).map((t) => t.amount);
  if (amounts.length === 0) return 0;
  return amounts.reduce((a, b) => a + b, 0) / amounts.length;
}

export function evaluate(txn, allTxns) {
  const reasons = [];
  const hour = hourOf(txn.date);
  const isOffHours = hour >= OFF_HOURS_START || hour < OFF_HOURS_END;

  // Rule 1: off-hours high-value
  if (isOffHours && txn.amount >= OFF_HOURS_HIGH_VALUE) {
    reasons.push(`Off-hours transfer at ${hour}:00 with high amount`);
  }

  // Rule 2: spike vs member's rolling average
  const avg = memberAverage(allTxns, txn.member);
  if (avg > 0 && txn.amount >= avg * SPIKE_MULTIPLIER) {
    const mult = (txn.amount / avg).toFixed(1);
    reasons.push(`Spike vs 30-day avg (${mult}x)`);
  }

  // Rule 3: velocity — >N transactions by same member within window
  const sameMember = allTxns.filter((t) => t.member === txn.member);
  if (sameMember.length > VELOCITY_LIMIT) {
    const sorted = [...sameMember].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = VELOCITY_LIMIT; i < sorted.length; i++) {
      const delta =
        new Date(sorted[i].date).getTime() -
        new Date(sorted[i - VELOCITY_LIMIT].date).getTime();
      if (delta <= VELOCITY_WINDOW_MIN * 60_000) {
        reasons.push(`Velocity: >${VELOCITY_LIMIT} tx in ${VELOCITY_WINDOW_MIN} min`);
        break;
      }
    }
  }

  return { flagged: reasons.length > 0, reasons };
}

export function annotate(txns) {
  return txns.map((t) => {
    const r = evaluate(t, txns);
    return { ...t, flagged: r.flagged, reason: r.reasons.join(" · ") || undefined };
  });
}
