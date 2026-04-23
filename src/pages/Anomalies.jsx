import { useMemo, useState } from "react";
import { Page, Card, Badge, StatCard, Modal, money } from "../components/ui";
import { TRANSACTIONS } from "../data";
import { AlertTriangle, ShieldAlert, Activity, CheckCircle2, Snowflake, Eye } from "lucide-react";

export default function Anomalies() {
  // Local state so Freeze/Clear actually mutate status
  const [txns, setTxns] = useState(() =>
    TRANSACTIONS.filter((t) => t.flagged).map((t) => ({ ...t, review: "pending" }))
  );
  const [detail, setDetail] = useState(null);

  const pending = txns.filter((t) => t.review === "pending");
  const frozen = txns.filter((t) => t.review === "frozen");
  const cleared = txns.filter((t) => t.review === "cleared");

  const total = TRANSACTIONS.length;
  const rate = ((txns.length / total) * 100).toFixed(1);

  const rules = [
    { name: "Off-hours high-value transfer (22:00–06:00, > NPR 100k)", hits: 1, tone: "red" },
    { name: "Spike vs 30-day rolling average (> 10×)",                hits: 1, tone: "red" },
    { name: "Multiple failed login attempts (> 3 in 5 min)",          hits: 1, tone: "amber" },
    { name: "Velocity: > 5 transactions in 1 minute",                  hits: 0, tone: "slate" },
    { name: "Geo-IP mismatch on member login",                         hits: 0, tone: "slate" },
  ];

  const freeze = (id) =>
    setTxns((ts) => ts.map((t) => (t.id === id ? { ...t, review: "frozen" } : t)));

  const clear = (id) =>
    setTxns((ts) => ts.map((t) => (t.id === id ? { ...t, review: "cleared" } : t)));

  const reopen = (id) =>
    setTxns((ts) => ts.map((t) => (t.id === id ? { ...t, review: "pending" } : t)));

  return (
    <Page title="Anomaly Detection" subtitle="Rule-based fraud & suspicious activity engine">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard icon={AlertTriangle} label="Flagged Events"       value={txns.length}          tone="red"    />
        <StatCard icon={Snowflake}     label="Frozen Transactions"  value={frozen.length}        tone="blue"   />
        <StatCard icon={CheckCircle2}  label="Cleared (False Pos.)" value={cleared.length}       tone="green"  />
        <StatCard icon={Activity}      label="Detection Rate"       value={`${rate}%`}           tone="amber"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">Flagged Transactions</div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Badge tone="red">{pending.length} pending</Badge>
              <Badge tone="blue">{frozen.length} frozen</Badge>
              <Badge tone="green">{cleared.length} cleared</Badge>
            </div>
          </div>
          <ul className="space-y-3">
            {txns.map((t) => (
              <li
                key={t.id}
                className={`border rounded-xl p-4 flex items-start gap-3 ${
                  t.review === "frozen"
                    ? "border-blue-200 bg-blue-50/60"
                    : t.review === "cleared"
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-red-200 bg-red-50/60"
                }`}
              >
                <div className={`h-10 w-10 rounded-lg grid place-items-center text-white ${
                  t.review === "frozen" ? "bg-blue-500" : t.review === "cleared" ? "bg-emerald-500" : "bg-red-500"
                }`}>
                  {t.review === "frozen" ? <Snowflake className="h-5 w-5" />
                    : t.review === "cleared" ? <CheckCircle2 className="h-5 w-5" />
                    : <AlertTriangle className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{t.id}</span>
                    <Badge tone={t.review === "frozen" ? "blue" : t.review === "cleared" ? "green" : "red"}>
                      {t.review === "frozen" ? "Frozen" : t.review === "cleared" ? "Cleared" : "High risk"}
                    </Badge>
                    <span className="text-xs text-slate-500">{t.date}</span>
                  </div>
                  <div className="text-sm mt-1">
                    <b>{t.member}</b> — {t.type} of <b>{money(t.amount)}</b> via {t.channel}
                  </div>
                  <div className="text-xs text-red-700 mt-1">Reason: {t.reason || "Flagged by anomaly rule"}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setDetail(t)}
                    className="h-8 px-3 rounded-md bg-white border border-slate-200 text-xs hover:bg-slate-50 flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" /> Review
                  </button>
                  {t.review === "pending" && (
                    <>
                      <button
                        onClick={() => clear(t.id)}
                        className="h-8 px-3 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Clear
                      </button>
                      <button
                        onClick={() => freeze(t.id)}
                        className="h-8 px-3 rounded-md bg-slate-900 text-white text-xs hover:bg-slate-800 flex items-center gap-1"
                      >
                        <Snowflake className="h-3.5 w-3.5" /> Freeze
                      </button>
                    </>
                  )}
                  {t.review !== "pending" && (
                    <button
                      onClick={() => reopen(t.id)}
                      className="h-8 px-3 rounded-md border border-slate-200 text-xs hover:bg-slate-50"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </li>
            ))}
            {txns.length === 0 && (
              <div className="text-slate-400 text-sm text-center py-10">No anomalies detected 🎉</div>
            )}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="font-semibold mb-4">Active Rules</div>
          <ul className="space-y-3">
            {rules.map((r, i) => (
              <li key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-sm">{r.name}</div>
                <Badge tone={r.tone}>{r.hits} hits</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-slate-500">
            Engine status: <span className="text-emerald-600 font-semibold">Running</span> · last scan: just now
          </div>
        </Card>
      </div>

      {/* Review modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Review ${detail.id}` : ""}
        subtitle="Investigator view · all actions are logged to the audit trail"
        footer={
          detail && (
            <>
              <button onClick={() => setDetail(null)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Close</button>
              {detail.review === "pending" && (
                <>
                  <button
                    onClick={() => { clear(detail.id); setDetail(null); }}
                    className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark Clear
                  </button>
                  <button
                    onClick={() => { freeze(detail.id); setDetail(null); }}
                    className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Snowflake className="h-4 w-4" /> Freeze Account
                  </button>
                </>
              )}
            </>
          )
        }
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <DetailRow label="Transaction ID" value={detail.id} />
            <DetailRow label="Date / Time" value={detail.date} />
            <DetailRow label="Member" value={detail.member} />
            <DetailRow label="Type" value={detail.type} />
            <DetailRow label="Channel" value={detail.channel} />
            <DetailRow label="Amount" value={<span className="font-semibold">{money(detail.amount)}</span>} />
            <DetailRow label="Current status" value={
              <Badge tone={detail.review === "frozen" ? "blue" : detail.review === "cleared" ? "green" : "red"}>
                {detail.review === "frozen" ? "Frozen" : detail.review === "cleared" ? "Cleared" : "Pending review"}
              </Badge>
            } />
            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
              <div className="text-xs font-semibold text-red-700 mb-1">Rule triggered</div>
              <div className="text-sm text-red-800">{detail.reason || "Flagged by anomaly rule"}</div>
            </div>
          </div>
        )}
      </Modal>
    </Page>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-1.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
