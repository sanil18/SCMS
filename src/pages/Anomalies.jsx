import { Page, Card, Badge, StatCard, money } from "../components/ui";
import { TRANSACTIONS } from "../data";
import { AlertTriangle, ShieldAlert, Activity, CheckCircle2 } from "lucide-react";

export default function Anomalies() {
  const flagged = TRANSACTIONS.filter((t) => t.flagged);
  const total = TRANSACTIONS.length;
  const rate = ((flagged.length / total) * 100).toFixed(1);

  const rules = [
    { name: "Off-hours high-value transfer (22:00–06:00, > NPR 100k)", hits: 1, tone: "red" },
    { name: "Spike vs 30-day rolling average (> 10×)", hits: 1, tone: "red" },
    { name: "Multiple failed login attempts (> 3 in 5 min)", hits: 1, tone: "amber" },
    { name: "Velocity: > 5 transactions in 1 minute", hits: 0, tone: "slate" },
    { name: "Geo-IP mismatch on member login", hits: 0, tone: "slate" },
  ];

  return (
    <Page
      title="Anomaly Detection"
      subtitle="Rule-based fraud & suspicious activity engine"
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard icon={AlertTriangle} label="Flagged Events" value={flagged.length} tone="red" />
        <StatCard icon={Activity} label="Detection Rate" value={`${rate}%`} tone="amber" />
        <StatCard icon={ShieldAlert} label="Active Rules" value={rules.length} tone="violet" />
        <StatCard icon={CheckCircle2} label="Clean Transactions" value={total - flagged.length} tone="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="font-semibold mb-4">Flagged Transactions</div>
          <ul className="space-y-3">
            {flagged.map((t) => (
              <li key={t.id} className="border border-red-200 bg-red-50/60 rounded-xl p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500 grid place-items-center text-white">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{t.id}</span>
                    <Badge tone="red">High risk</Badge>
                    <span className="text-xs text-slate-500">{t.date}</span>
                  </div>
                  <div className="text-sm mt-1">
                    <b>{t.member}</b> — {t.type} of <b>{money(t.amount)}</b> via {t.channel}
                  </div>
                  <div className="text-xs text-red-700 mt-1">Reason: {t.reason}</div>
                </div>
                <div className="flex gap-2">
                  <button className="h-8 px-3 rounded-md bg-white border border-slate-200 text-xs hover:bg-slate-50">Review</button>
                  <button className="h-8 px-3 rounded-md bg-slate-900 text-white text-xs hover:bg-slate-800">Freeze</button>
                </div>
              </li>
            ))}
            {flagged.length === 0 && (
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
    </Page>
  );
}
