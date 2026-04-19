import { Page, Table, Card, StatCard, money } from "../components/ui";
import { MEMBERS, TRANSACTIONS } from "../data";
import { PiggyBank, TrendingUp, Wallet, Plus } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Savings() {
  const { user } = useAuth();
  const list = user.role === "member"
    ? MEMBERS.filter((m) => m.name === user.name)
    : MEMBERS;

  const total = list.reduce((a, m) => a + m.savings, 0);
  const avg = list.length ? total / list.length : 0;

  const recent = TRANSACTIONS.filter((t) =>
    ["Deposit", "Withdrawal"].includes(t.type) &&
    (user.role !== "member" || t.member === user.name)
  );

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
          <button className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800">
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
        </ul>
      </Card>
    </Page>
  );
}
