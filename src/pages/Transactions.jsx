import { useState } from "react";
import { Page, Table, Badge, Card, Modal, Field, Input, Select, money } from "../components/ui";
import { TRANSACTIONS, MEMBERS } from "../data";
import { Search, Filter, Download, Plus, Printer, ShieldCheck, Receipt } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Transactions() {
  const { user } = useAuth();
  const [list, setList] = useState([...TRANSACTIONS]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const [form, setForm] = useState({ member: MEMBERS[0].name, type: "Deposit", amount: 1000, channel: "Branch" });

  let rows = user.role === "member" ? list.filter((t) => t.member === user.name) : list;
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

  const post = (e) => {
    e.preventDefault();
    const amt = Number(form.amount);
    // basic anomaly rule — flag if > NPR 100,000
    const flagged = amt > 100000;
    const id = `T-${5100 + list.length}`;
    const now = new Date();
    const date = now.toISOString().slice(0, 16).replace("T", " ");
    const tx = {
      id,
      date,
      member: form.member,
      type: form.type,
      amount: amt,
      channel: form.channel,
      flagged,
      reason: flagged ? "High amount · auto-flagged by threshold rule" : undefined,
    };
    setList((ls) => [tx, ...ls]);
    setOpen(false);
    setVoucher(tx);
  };

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
            <button
              onClick={() => setOpen(true)}
              className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800"
            >
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
                tab === t.k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
            key: "type", label: "Type",
            render: (r) => (
              <Badge tone={r.type === "Deposit" ? "green" : r.type === "Withdrawal" ? "blue" : r.type === "Loan Repay" ? "violet" : "slate"}>
                {r.type}
              </Badge>
            ),
          },
          { key: "channel", label: "Channel" },
          { key: "amount", label: "Amount", render: (r) => <span className="font-semibold">{money(r.amount)}</span> },
          {
            key: "flagged", label: "Risk",
            render: (r) =>
              r.flagged ? (
                <span title={r.reason}><Badge tone="red">Anomaly</Badge></span>
              ) : (
                <Badge tone="green">OK</Badge>
              ),
          },
          {
            key: "actions", label: "Voucher",
            render: (r) => (
              <button
                onClick={() => setVoucher(r)}
                className="h-7 px-2 rounded-md border border-slate-200 text-xs flex items-center gap-1 hover:bg-slate-50"
              >
                <Receipt className="h-3.5 w-3.5" /> View
              </button>
            ),
          },
        ]}
        rows={rows}
      />

      {/* Post transaction modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Post New Transaction"
        subtitle="Transaction is validated, scored for anomalies and immediately reflected in the passbook"
        footer={
          <>
            <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={post} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Post Transaction
            </button>
          </>
        }
      >
        <form onSubmit={post} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Member">
            <Select value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })}>
              {MEMBERS.map((m) => <option key={m.id}>{m.name}</option>)}
            </Select>
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Deposit</option>
              <option>Withdrawal</option>
              <option>Loan Repay</option>
              <option>Transfer</option>
            </Select>
          </Field>
          <Field label="Amount (NPR)">
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </Field>
          <Field label="Channel">
            <Select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
              <option>Branch</option>
              <option>ATM</option>
              <option>Online</option>
              <option>Mobile</option>
            </Select>
          </Field>
        </form>
      </Modal>

      <VoucherModal voucher={voucher} onClose={() => setVoucher(null)} />
    </Page>
  );
}

function VoucherModal({ voucher, onClose }) {
  if (!voucher) return null;
  return (
    <Modal
      open={!!voucher}
      onClose={onClose}
      title="Digital Voucher"
      subtitle="Auto-generated receipt · printable"
      footer={
        <>
          <button onClick={onClose} className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Close</button>
          <button onClick={() => window.print()} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print
          </button>
        </>
      }
    >
      <div className="border border-dashed border-slate-300 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500">SCMS Cooperative</div>
            <div className="text-lg font-bold">Transaction Voucher</div>
            <div className="text-xs text-slate-500">Voucher #{voucher.id}</div>
          </div>
          <Badge tone={voucher.flagged ? "red" : "green"}>
            {voucher.flagged ? "Flagged for review" : "Validated"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Line label="Date / Time" value={voucher.date} />
          <Line label="Type" value={voucher.type} />
          <Line label="Member" value={voucher.member} />
          <Line label="Channel" value={voucher.channel} />
          <Line label="Amount" value={<span className="font-semibold">{money(voucher.amount)}</span>} />
          <Line label="Status" value={voucher.flagged ? "Pending review" : "Posted"} />
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500 flex items-center justify-between">
          <div>Authorized by: Accountant · Priya Khadka</div>
          <div>Generated by SCMS · {new Date().toLocaleString()}</div>
        </div>
      </div>
    </Modal>
  );
}

function Line({ label, value }) {
  return (
    <div className="flex justify-between border-b border-dashed border-slate-200 py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
