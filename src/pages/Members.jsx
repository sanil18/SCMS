import { useState } from "react";
import { Page, Table, Badge, Card, money } from "../components/ui";
import { MEMBERS } from "../data";
import { Plus, Search, Filter, Download, ShieldCheck } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Members() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [, forceUpdate] = useState(0);

  const verifyKyc = (m) => {
    m.kyc = "Verified";
    forceUpdate((n) => n + 1);
  };

  const rows = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.id.toLowerCase().includes(q.toLowerCase()) ||
      m.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Page
      title="Members"
      subtitle={`${MEMBERS.length} registered members`}
      actions={
        <>
          <button className="h-10 px-3 rounded-lg bg-white border border-slate-200 text-sm flex items-center gap-2 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800">
            <Plus className="h-4 w-4" /> New Member
          </button>
        </>
      }
    >
      <Card className="p-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, ID, email…"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-100 text-sm outline-none focus:ring-2 ring-blue-400/40"
          />
        </div>
        <button className="h-10 px-3 rounded-lg border border-slate-200 text-sm flex items-center gap-2 hover:bg-slate-50">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </Card>

      <Table
        columns={[
          { key: "id", label: "ID" },
          {
            key: "name",
            label: "Member",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center text-white text-xs font-bold">
                  {r.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.email}</div>
                </div>
              </div>
            ),
          },
          { key: "phone", label: "Phone" },
          { key: "joined", label: "Joined" },
          {
            key: "kyc",
            label: "KYC",
            render: (r) => <Badge tone={r.kyc === "Verified" ? "green" : "amber"}>{r.kyc}</Badge>,
          },
          {
            key: "status",
            label: "Status",
            render: (r) => <Badge tone={r.status === "Active" ? "green" : "red"}>{r.status}</Badge>,
          },
          { key: "savings", label: "Savings", render: (r) => money(r.savings) },
          { key: "loans", label: "Loan Bal.", render: (r) => (r.loans ? money(r.loans) : "—") },
          ...(user.role === "admin"
            ? [
                {
                  key: "actions",
                  label: "Actions",
                  render: (r) =>
                    r.kyc === "Pending" ? (
                      <button
                        onClick={() => verifyKyc(r)}
                        className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" /> Verify KYC
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    ),
                },
              ]
            : []),
        ]}
        rows={rows}
      />
    </Page>
  );
}
