import { Page, Table, Badge, Card } from "../components/ui";
import { AUDIT_LOGS } from "../data";
import { FileClock, ShieldCheck, AlertTriangle } from "lucide-react";
import { StatCard } from "../components/ui";

export default function AuditLog() {
  const alerts = AUDIT_LOGS.filter((a) => a.status === "alert").length;
  const success = AUDIT_LOGS.filter((a) => a.status === "success").length;

  return (
    <Page
      title="Audit Log"
      subtitle="Immutable forensic record of every system action"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FileClock} label="Total Events" value={AUDIT_LOGS.length} tone="blue" />
        <StatCard icon={ShieldCheck} label="Successful" value={success} tone="green" />
        <StatCard icon={AlertTriangle} label="Security Alerts" value={alerts} tone="red" />
      </div>

      <Card className="p-4 text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        Log chain integrity verified · SHA-256 root:{" "}
        <code className="text-slate-700">0x9f3a…c71e</code>
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
              <Badge tone={r.status === "alert" ? "red" : "green"}>
                {r.status}
              </Badge>
            ),
          },
        ]}
        rows={AUDIT_LOGS}
      />
    </Page>
  );
}
