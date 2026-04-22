import { useState } from "react";
import { Page, Table, Badge, StatCard, Card, Modal, Field, Input, Select, Progress, money } from "../components/ui";
import { LOANS, MEMBERS } from "../data";
import { Landmark, CircleDollarSign, Clock, Plus, Percent, Check, X } from "lucide-react";
import { useAuth } from "../AuthContext";
import { calcEmi, totalInterest } from "../lib/finance";

export default function Loans() {
  const { user } = useAuth();
  const [list, setList] = useState([...LOANS]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ member: MEMBERS[0].name, amount: 50000, rate: 12, term: 12 });

  const visible = user.role === "member" ? list.filter((l) => l.member === user.name) : list;
  const active = visible.filter((l) => l.status === "Active");
  const outstanding = active.reduce((a, l) => a + l.balance, 0);
  const pending = visible.filter((l) => l.status === "Pending").length;

  const setStatus = (id, status) =>
    setList((ls) => ls.map((l) => (l.id === id ? { ...l, status, nextDue: status === "Active" ? "2026-05-15" : l.nextDue } : l)));

  const createLoan = (e) => {
    e.preventDefault();
    const id = `L-${9000 + list.length + 1}`;
    setList((ls) => [
      ...ls,
      {
        id,
        member: form.member,
        amount: Number(form.amount),
        rate: Number(form.rate),
        term: Number(form.term),
        status: "Pending",
        nextDue: "-",
        balance: Number(form.amount),
      },
    ]);
    setOpen(false);
  };

  return (
    <Page
      title="Loans"
      subtitle="Loan applications, approvals, disbursements and repayments"
      actions={
        user.role !== "member" && (
          <button
            onClick={() => setOpen(true)}
            className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800"
          >
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
          value={`${(visible.reduce((a, l) => a + l.rate, 0) / (visible.length || 1)).toFixed(1)}%`}
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
            key: "emi", label: "Monthly EMI",
            render: (r) => <span className="font-semibold">{money(Math.round(calcEmi(r.amount, r.rate, r.term)))}</span>,
          },
          {
            key: "interest", label: "Total Interest",
            render: (r) => <span className="text-violet-700">{money(Math.round(totalInterest(r.amount, r.rate, r.term)))}</span>,
          },
          {
            key: "progress", label: "Repayment",
            render: (r) => {
              const pct = ((r.amount - r.balance) / r.amount) * 100;
              return (
                <div className="w-40">
                  <Progress value={pct} tone={pct >= 90 ? "green" : pct >= 50 ? "blue" : "violet"} />
                  <div className="text-[10px] text-slate-500 mt-1">
                    {money(r.amount - r.balance)} / {money(r.amount)} ({pct.toFixed(0)}%)
                  </div>
                </div>
              );
            },
          },
          { key: "nextDue", label: "Next Due" },
          {
            key: "status", label: "Status",
            render: (r) => (
              <Badge tone={r.status === "Active" ? "green" : r.status === "Pending" ? "amber" : r.status === "Rejected" ? "red" : "slate"}>
                {r.status}
              </Badge>
            ),
          },
          ...(user.role !== "member"
            ? [{
                key: "actions", label: "Actions",
                render: (r) =>
                  r.status === "Pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setStatus(r.id, "Active")}
                        className="h-7 px-2 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => setStatus(r.id, "Rejected")}
                        className="h-7 px-2 rounded-md bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 text-xs flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  ),
              }]
            : []),
        ]}
        rows={visible}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Loan Application"
        subtitle="Application is submitted for Accountant/Admin approval"
        footer={
          <>
            <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={createLoan} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Submit Application
            </button>
          </>
        }
      >
        <form onSubmit={createLoan} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Member">
            <Select value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })}>
              {MEMBERS.map((m) => <option key={m.id}>{m.name}</option>)}
            </Select>
          </Field>
          <Field label="Principal (NPR)">
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </Field>
          <Field label="Interest rate (% p.a.)">
            <Input type="number" step="0.1" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} required />
          </Field>
          <Field label="Term (months)">
            <Input type="number" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} required />
          </Field>
          <Card className="p-3 sm:col-span-2 bg-slate-50 text-sm flex items-center justify-between">
            <div className="text-slate-600">Estimated Monthly EMI</div>
            <div className="font-semibold">{money(Math.round(calcEmi(Number(form.amount), Number(form.rate), Number(form.term))))}</div>
          </Card>
        </form>
      </Modal>
    </Page>
  );
}
