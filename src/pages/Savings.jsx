import { useMemo, useState } from "react";
import { Page, Table, Card, StatCard, Modal, Field, Input, Select, money } from "../components/ui";
import { MEMBERS, TRANSACTIONS } from "../data";
import { PiggyBank, TrendingUp, Wallet, Plus, Banknote, CheckCircle2 } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Savings() {
  const { user } = useAuth();

  // Local state so deposits/withdrawals mutate balances live
  const [members, setMembers] = useState([...MEMBERS]);
  const [txns, setTxns] = useState([...TRANSACTIONS]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    member: (user.role === "member" ? user.name : MEMBERS[0].name),
    type: "Deposit",
    amount: 1000,
    channel: "Branch",
  });
  const [confirmation, setConfirmation] = useState(null);

  const list = useMemo(
    () => (user.role === "member" ? members.filter((m) => m.name === user.name) : members),
    [members, user]
  );

  const total = list.reduce((a, m) => a + m.savings, 0);
  const avg = list.length ? total / list.length : 0;

  const recent = txns.filter((t) =>
    ["Deposit", "Withdrawal"].includes(t.type) &&
    (user.role !== "member" || t.member === user.name)
  );

  const post = (e) => {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return;
    const delta = form.type === "Deposit" ? amt : -amt;
    setMembers((ms) => ms.map((m) => (m.name === form.member ? { ...m, savings: Math.max(0, m.savings + delta) } : m)));
    const id = `T-${5200 + txns.length}`;
    const tx = {
      id,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      member: form.member,
      type: form.type,
      amount: amt,
      channel: form.channel,
      flagged: amt > 100000,
      reason: amt > 100000 ? "High amount · auto-flagged by threshold rule" : undefined,
    };
    setTxns((ts) => [tx, ...ts]);
    setOpen(false);
    setConfirmation(tx);
    setForm((f) => ({ ...f, amount: 1000 }));
  };

  return (
    <Page title="Savings" subtitle="Member deposits, withdrawals and balances">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={PiggyBank} label="Total Savings" value={money(total)} tone="green" />
        <StatCard icon={Wallet} label="Average Balance" value={money(Math.round(avg))} tone="blue" />
        <StatCard icon={TrendingUp} label="Accounts" value={list.length} tone="violet" />
      </div>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <div className="font-semibold">Savings Accounts</div>
          <div className="text-xs text-slate-500">All active savings ledgers</div>
        </div>
        {user.role !== "member" && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> New Deposit
          </button>
        )}
      </Card>

      <Table
        columns={[
          { key: "id", label: "Account" },
          { key: "name", label: "Member" },
          { key: "joined", label: "Opened" },
          { key: "savings", label: "Balance", render: (r) => <span className="font-semibold">{money(r.savings)}</span> },
        ]}
        rows={list}
      />

      <Card className="p-5">
        <div className="font-semibold mb-3">Recent Movements</div>
        <ul className="divide-y divide-slate-100">
          {recent.slice(0, 8).map((t) => (
            <li key={t.id} className="py-2.5 flex items-center gap-3 text-sm">
              <div className={`h-8 w-8 rounded-lg grid place-items-center text-white text-xs font-bold ${t.type === "Deposit" ? "bg-emerald-500" : "bg-blue-500"}`}>
                {t.type[0]}
              </div>
              <div className="flex-1">
                <div className="font-medium">{t.member}</div>
                <div className="text-xs text-slate-500">{t.type} · {t.channel} · {t.date}</div>
              </div>
              <div className={`font-semibold ${t.type === "Deposit" ? "text-emerald-600" : "text-blue-600"}`}>
                {t.type === "Deposit" ? "+" : "−"} {money(t.amount)}
              </div>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="text-center text-slate-400 text-sm py-6">No deposits or withdrawals recorded yet.</li>
          )}
        </ul>
      </Card>

      {/* New deposit / withdrawal modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Cash Movement"
        subtitle="Posts a deposit or withdrawal and updates the member's balance instantly"
        footer={
          <>
            <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={post} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2">
              <Banknote className="h-4 w-4" /> Post
            </button>
          </>
        }
      >
        <form onSubmit={post} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Member">
            <Select value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })}>
              {members.map((m) => <option key={m.id}>{m.name}</option>)}
            </Select>
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Deposit</option>
              <option>Withdrawal</option>
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

      {/* Success confirmation */}
      <Modal
        open={!!confirmation}
        onClose={() => setConfirmation(null)}
        title="Transaction posted"
        subtitle="Savings balance updated"
        footer={
          <button onClick={() => setConfirmation(null)} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">Done</button>
        }
      >
        {confirmation && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            <div className="text-sm">
              <div className="font-semibold">
                {confirmation.type} of {money(confirmation.amount)} posted for {confirmation.member}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Voucher #{confirmation.id} · via {confirmation.channel} · {confirmation.date}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Page>
  );
}
