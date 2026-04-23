import { useMemo, useState } from "react";
import { Page, Table, Badge, Card, StatCard, Input } from "../components/ui";
import { AUDIT_LOGS } from "../data";
import { FileClock, ShieldCheck, AlertTriangle, Search } from "lucide-react";

export default function AuditLog() {
  const [filter, setFilter] = useState("all"); // all | success | alert
  const [q, setQ] = useState("");

  const counts = useMemo(
    () => ({
      all: AUDIT_LOGS.length,
      success: AUDIT_LOGS.filter((a) => a.status === "success").length,
      alert: AUDIT_LOGS.filter((a) => a.status === "alert").length,
    }),
    []
  );

  const rows = useMemo(() => {
    let r = AUDIT_LOGS;
    if (filter !== "all") r = r.filter((a) => a.status === filter);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter(
        (a) =>
          a.actor.toLowerCase().includes(s) ||
          a.action.toLowerCase().includes(s) ||
          (a.target || "").toLowerCase().includes(s) ||
          (a.ip || "").toLowerCase().includes(s)
      );
    }
    return r;
  }, [filter, q]);

  return (
    <Page title="Audit Log" subtitle="Immutable forensic record of every system action">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button type="button" onClick={() => setFilter("all")} className="text-left">
          <StatCard
            icon={FileClock}
            label="Total Events"
            value={counts.all}
            tone="blue"
            className={filter === "all" ? "ring-2 ring-blue-400" : ""}
          />
        </button>
        <button type="button" onClick={() => setFilter("success")} className="text-left">
          <StatCard
            icon={ShieldCheck}
            label="Successful"
            value={counts.success}
            tone="green"
            className={filter === "success" ? "ring-2 ring-emerald-400" : ""}
          />
        </button>
        <button type="button" onClick={() => setFilter("alert")} className="text-left">
          <StatCard
            icon={AlertTriangle}
            label="Security Alerts"
            value={counts.alert}
            tone="red"
            className={filter === "alert" ? "ring-2 ring-red-400" : ""}
          />
        </button>
      </div>

      <Card className="p-4 text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        Log chain integrity verified · SHA-256 root:{" "}
        <code className="text-slate-700">0x9f3a…c71e</code>
      </Card>

      <Card className="p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex gap-1 flex-wrap">
          {[
            { k: "all",     label: "All events" },
            { k: "success", label: "Successful" },
            { k: "alert",   label: "Security alerts" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setFilter(t.k)}
              className={`px-3 h-9 rounded-lg text-sm transition ${
                filter === t.k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label} <span className="ml-1 text-xs opacity-70">· {counts[t.k]}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by actor, action, target or IP…"
            className="!pl-9"
          />
        </div>
      </Card>

      <Table
        columns={[
          { key: "ts", label: "Timestamp" },
          { key: "actor", label: "Actor" },
          {
            key: "action",
            label: "Action",
            render: (r) => <code className="text-xs">{r.action}</code>,
          },
          { key: "target", label: "Target" },
          { key: "ip", label: "IP" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge tone={r.status === "alert" ? "red" : "green"}>{r.status}</Badge>
            ),
          },
        ]}
        rows={rows}
        empty="No audit entries match the current filter."
      />
    </Page>
  );
}
