import { Page, Card, StatCard, Badge, money } from "../components/ui";
import { MEMBERS, LOANS, TRANSACTIONS, MONTHLY_STATS, AUDIT_LOGS } from "../data";
import { totalInterest, calcEmi } from "../lib/finance";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { FileBarChart2, Printer, Download, Landmark, PiggyBank, Users, AlertTriangle } from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

export default function Reports() {
  const totalSavings = MEMBERS.reduce((a, m) => a + m.savings, 0);
  const activeLoans = LOANS.filter((l) => l.status === "Active");
  const outstanding = activeLoans.reduce((a, l) => a + l.balance, 0);
  const disbursed = LOANS.reduce((a, l) => a + l.amount, 0);
  const projectedInterest = LOANS.filter((l) => l.status !== "Completed")
    .reduce((a, l) => a + totalInterest(l.amount, l.rate, l.term), 0);

  const kycBreakdown = [
    { name: "Verified", value: MEMBERS.filter((m) => m.kyc === "Verified").length },
    { name: "Pending",  value: MEMBERS.filter((m) => m.kyc === "Pending").length },
  ];

  const loanStatus = ["Active", "Pending", "Completed"].map((s) => ({
    name: s,
    value: LOANS.filter((l) => l.status === s).length,
  }));

  const txnByType = ["Deposit", "Withdrawal", "Loan Repay", "Transfer"].map((t) => ({
    type: t,
    amount: TRANSACTIONS.filter((x) => x.type === t).reduce((a, x) => a + x.amount, 0),
  }));

  const flagged = TRANSACTIONS.filter((t) => t.flagged).length;

  return (
    <Page
      title="Financial Reports"
      subtitle="Month-end and ad-hoc reports across the cooperative"
      actions={
        <>
          <button
            onClick={() => window.print()}
            className="h-10 px-3 rounded-lg bg-white border border-slate-200 text-sm flex items-center gap-2 hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
          <button className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </>
      }
    >
      {/* Report header — looks official when printed */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500">SCMS · Monthly Financial Report</div>
            <div className="text-2xl font-bold mt-1">Cooperative Performance — {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}</div>
            <div className="text-sm text-slate-500 mt-1">
              Generated {new Date().toLocaleString()} · Report ID: RPT-{Date.now().toString().slice(-6)}
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center text-white shadow">
            <FileBarChart2 className="h-6 w-6" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}     label="Registered Members"  value={MEMBERS.length}           tone="blue"   />
        <StatCard icon={PiggyBank} label="Total Savings"        value={money(totalSavings)}      tone="green"  />
        <StatCard icon={Landmark}  label="Outstanding Loans"    value={money(outstanding)}       tone="violet" />
        <StatCard icon={AlertTriangle} label="Flagged Transactions" value={flagged}              tone="red"    />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="font-semibold mb-1">Deposits vs Withdrawals vs Loans</div>
          <div className="text-xs text-slate-500 mb-4">Last 6 months · NPR</div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={MONTHLY_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => money(v)} />
                <Legend />
                <Line type="monotone" dataKey="deposits"    stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="withdrawals" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="loans"       stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="font-semibold mb-1">KYC Status</div>
          <div className="text-xs text-slate-500 mb-4">Compliance readiness</div>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={kycBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {kycBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="font-semibold mb-1">Transaction Volume by Type</div>
          <div className="text-xs text-slate-500 mb-4">Current period</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={txnByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => money(v)} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {txnByType.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="font-semibold mb-1">Loan Portfolio Status</div>
          <div className="text-xs text-slate-500 mb-4">Breakdown of {LOANS.length} loans</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={loanStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                  {loanStatus.map((_, i) => <Cell key={i} fill={COLORS[i + 1]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold">Loan Portfolio Summary</div>
            <div className="text-xs text-slate-500">EMI and projected interest per loan</div>
          </div>
          <Badge tone="blue">Reducing-balance method</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-left">
              <tr className="border-b border-slate-100">
                <th className="py-2">Loan ID</th>
                <th className="py-2">Member</th>
                <th className="py-2">Principal</th>
                <th className="py-2">Rate</th>
                <th className="py-2">Term</th>
                <th className="py-2">Monthly EMI</th>
                <th className="py-2">Total Interest</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LOANS.map((l) => (
                <tr key={l.id}>
                  <td className="py-2 font-medium">{l.id}</td>
                  <td className="py-2">{l.member}</td>
                  <td className="py-2">{money(l.amount)}</td>
                  <td className="py-2">{l.rate}%</td>
                  <td className="py-2">{l.term} mo</td>
                  <td className="py-2 font-semibold">{money(Math.round(calcEmi(l.amount, l.rate, l.term)))}</td>
                  <td className="py-2 text-violet-700">{money(Math.round(totalInterest(l.amount, l.rate, l.term)))}</td>
                  <td className="py-2">
                    <Badge tone={l.status === "Active" ? "green" : l.status === "Pending" ? "amber" : "slate"}>
                      {l.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-semibold">
                <td className="py-3" colSpan={2}>Totals</td>
                <td className="py-3">{money(disbursed)}</td>
                <td className="py-3" colSpan={2}></td>
                <td className="py-3"></td>
                <td className="py-3 text-violet-700">{money(Math.round(projectedInterest))}</td>
                <td className="py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <div className="font-semibold mb-2">Security & Compliance Summary</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <KV label="Audit events recorded" value={AUDIT_LOGS.length} />
          <KV label="Security alerts (period)" value={AUDIT_LOGS.filter((a) => a.status === "alert").length} />
          <KV label="Flagged transactions" value={flagged} />
          <KV label="MFA enforcement" value="100% of staff roles" />
          <KV label="Password hashing" value="bcrypt (10 salt rounds)" />
          <KV label="Transport security" value="TLS 1.3" />
        </div>
      </Card>
    </Page>
  );
}

function KV({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
