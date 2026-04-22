import { Page, StatCard, Card, Badge, money } from "../components/ui";
import { Users, PiggyBank, Landmark, AlertTriangle, TrendingUp } from "lucide-react";
import { MEMBERS, LOANS, TRANSACTIONS, MONTHLY_STATS, AUDIT_LOGS } from "../data";
import { useAuth } from "../AuthContext";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const isMember = user.role === "member";

  const scopedMembers = isMember ? MEMBERS.filter((m) => m.name === user.name) : MEMBERS;
  const scopedLoans = isMember ? LOANS.filter((l) => l.member === user.name) : LOANS;
  const scopedTxns = isMember ? TRANSACTIONS.filter((t) => t.member === user.name) : TRANSACTIONS;

  const totalSavings = scopedMembers.reduce((a, m) => a + m.savings, 0);
  const totalLoans = scopedLoans.filter((l) => l.status === "Active").reduce((a, l) => a + l.balance, 0);
  const flagged = scopedTxns.filter((t) => t.flagged).length;

  return (
    <Page
      title={`Welcome back, ${user.name.split(" ")[0]} 👋`}
      subtitle={isMember ? "Here is your personal cooperative summary." : "Here is what's happening across your cooperative today."}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {!isMember && (
          <StatCard icon={Users} label="Active Members" value={MEMBERS.filter(m=>m.status==="Active").length} trend="+3 this month" tone="blue" />
        )}
        <StatCard icon={PiggyBank} label={isMember ? "My Savings" : "Total Savings"} value={money(totalSavings)} trend={isMember ? "Updated today" : "+4.2% MoM"} tone="green" />
        <StatCard icon={Landmark} label={isMember ? "My Outstanding Loan" : "Outstanding Loans"} value={money(totalLoans)} trend={isMember ? `${scopedLoans.filter(l=>l.status==='Active').length} active` : "3 active"} tone="violet" />
        <StatCard icon={AlertTriangle} label={isMember ? "My Flagged Activity" : "Flagged Transactions"} value={flagged} trend="Last 24h" tone="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Cashflow Overview</h3>
              <p className="text-xs text-slate-500">Deposits vs withdrawals (last 6 months)</p>
            </div>
            <Badge tone="green"><TrendingUp className="h-3 w-3 mr-1 inline" />Healthy</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={MONTHLY_STATS}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v)=>`${v/1000}k`} />
                <Tooltip formatter={(v)=>money(v)} />
                <Area type="monotone" dataKey="deposits" stroke="#10b981" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="withdrawals" stroke="#3b82f6" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-1">Loans Disbursed</h3>
          <p className="text-xs text-slate-500 mb-4">Monthly disbursement</p>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={MONTHLY_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v)=>`${v/1000}k`} />
                <Tooltip formatter={(v)=>money(v)} />
                <Bar dataKey="loans" fill="#8b5cf6" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className={`grid grid-cols-1 ${isMember ? "" : "lg:grid-cols-2"} gap-4`}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{isMember ? "My Recent Transactions" : "Recent Transactions"}</h3>
            <Badge tone="blue">Live</Badge>
          </div>
          <ul className="divide-y divide-slate-100">
            {scopedTxns.slice(0, 6).map((t) => (
              <li key={t.id} className="py-3 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg grid place-items-center text-white text-xs font-bold ${
                  t.flagged ? "bg-red-500" : t.type === "Deposit" ? "bg-emerald-500" : t.type === "Withdrawal" ? "bg-blue-500" : "bg-violet-500"
                }`}>
                  {t.type[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.member}</div>
                  <div className="text-xs text-slate-500">{t.type} · {t.channel} · {t.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{money(t.amount)}</div>
                  {t.flagged && <Badge tone="red">Flagged</Badge>}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {!isMember && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Security Events</h3>
              <Badge tone="amber">{AUDIT_LOGS.filter(a=>a.status==="alert").length} alerts</Badge>
            </div>
            <ul className="divide-y divide-slate-100">
              {AUDIT_LOGS.slice(0, 6).map((a) => (
                <li key={a.id} className="py-3 flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${a.status === "alert" ? "bg-red-500" : "bg-emerald-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{a.action.replaceAll("_", " ")}</div>
                    <div className="text-xs text-slate-500">by {a.actor} · target {a.target} · IP {a.ip}</div>
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap">{a.ts.split(" ")[1]}</div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </Page>
  );
}
