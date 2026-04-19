import { useState } from "react";
import { Page, Table, Badge, Card, money } from "../components/ui";
import { TRANSACTIONS } from "../data";
import { Search, Filter, Download, Plus } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Transactions() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");

  let rows = user.role === "member"
    ? TRANSACTIONS.filter((t) => t.member === user.name)
    : TRANSACTIONS;

  if (tab === "flagged") rows = rows.filter((r) => r.flagged);
  else if (tab !== "all") rows = rows.filter((r) => r.type.toLowerCase() === tab);

  if (q) {
    const s = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.member.toLowerCase().includes(s) ||
        r.id.toLowerCase().includes(s) ||
        r.type.toLowerCase().includes(s)
    );
  }

  const tabs = [
    { k: "all", label: "All" },
    { k: "deposit", label: "Deposits" },
    { k: "withdrawal", label: "Withdrawals" },
    { k: "loan repay", label: "Repayments" },
    { k: "flagged", label: "Flagged" },
  ];

  return (
    <Page
      title="Transactions"
      subtitle="All money movements across the cooperative"
      actions={
        <>
          <button className="h-10 px-3 rounded-lg bg-white border border-slate-200 text-sm flex items-center gap-2 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Export
          </button>
          {user.role !== "member" && (
            <button className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800">
              <Plus className="h-4 w-4" /> New Transaction
            </button>
          )}
        </>
      }
    >
      <Card className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search transactions…"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-100 text-sm outline-none focus:ring-2 ring-blue-400/40"
            />
          </div>
          <button className="h-10 px-3 rounded-lg border border-slate-200 text-sm flex items-center gap-2 hover:bg-slate-50">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        <div className="flex gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`px-3 h-8 rounded-lg text-sm transition ${
                tab === t.k
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      <Table
        columns={[
          { key: "id", label: "ID" },
          { key: "date", label: "Date" },
          { key: "member", label: "Member" },
          {
            key: "type",
            label: "Type",
            render: (r) => (
              <Badge tone={r.type === "Deposit" ? "green" : r.type === "Withdrawal" ? "blue" : r.type === "Loan Repay" ? "violet" : "slate"}>
                {r.type}
              </Badge>
            ),
          },
          { key: "channel", label: "Channel" },
          { key: "amount", label: "Amount", render: (r) => <span className="font-semibold">{money(r.amount)}</span> },
          {
            key: "flagged",
            label: "Risk",
            render: (r) =>
              r.flagged ? (
                <span title={r.reason}>
                  <Badge tone="red">Anomaly</Badge>
                </span>
              ) : (
                <Badge tone="green">OK</Badge>
              ),
          },
        ]}
        rows={rows}
      />
    </Page>
  );
}
