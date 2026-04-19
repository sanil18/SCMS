import { Page, Table, Badge, StatCard, money } from "../components/ui";
import { LOANS } from "../data";
import { Landmark, CircleDollarSign, Clock, Plus, Percent } from "lucide-react";
import { useAuth } from "../AuthContext";
import { calcEmi, totalInterest } from "../lib/finance";

export default function Loans() {
  const { user } = useAuth();
  const list = user.role === "member"
    ? LOANS.filter((l) => l.member === user.name)
    : LOANS;

  const active = list.filter((l) => l.status === "Active");
  const outstanding = active.reduce((a, l) => a + l.balance, 0);
  const pending = list.filter((l) => l.status === "Pending").length;

  return (
    <Page
      title="Loans"
      subtitle="Loan applications, disbursements and repayments"
      actions={
        user.role !== "member" && (
          <button className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800">
            <Plus className="h-4 w-4" /> New Loan
          </button>
        )
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard icon={Landmark} label="Active Loans" value={active.length} tone="violet" />
        <StatCard icon={CircleDollarSign} label="Outstanding Balance" value={money(outstanding)} tone="blue" />
        <StatCard icon={Clock} label="Pending Approval" value={pending} tone="amber" />
        <StatCard
          icon={Percent}
          label="Avg. Interest Rate"
          value={`${(list.reduce((a, l) => a + l.rate, 0) / (list.length || 1)).toFixed(1)}%`}
          tone="green"
        />
      </div>

      <Table
        columns={[
          { key: "id", label: "Loan ID" },
          { key: "member", label: "Member" },
          { key: "amount", label: "Principal", render: (r) => money(r.amount) },
          { key: "rate", label: "Rate", render: (r) => `${r.rate}%` },
          { key: "term", label: "Term", render: (r) => `${r.term} mo` },
          {
            key: "emi",
            label: "Monthly EMI",
            render: (r) => (
              <span className="font-semibold">
                {money(Math.round(calcEmi(r.amount, r.rate, r.term)))}
              </span>
            ),
          },
          {
            key: "interest",
            label: "Total Interest",
            render: (r) => (
              <span className="text-violet-700">
                {money(Math.round(totalInterest(r.amount, r.rate, r.term)))}
              </span>
            ),
          },
          { key: "balance", label: "Balance", render: (r) => money(r.balance) },
          { key: "nextDue", label: "Next Due" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge tone={r.status === "Active" ? "green" : r.status === "Pending" ? "amber" : "slate"}>
                {r.status}
              </Badge>
            ),
          },
        ]}
        rows={list}
      />
    </Page>
  );
}
