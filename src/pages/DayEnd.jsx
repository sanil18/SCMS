import { useMemo, useState } from "react";
import { Page, Card, Table, Badge, StatCard, money, Field, Input } from "../components/ui";
import { TRANSACTIONS } from "../data";
import { ClipboardCheck, CheckCircle2, AlertTriangle, Printer, Scale, Wallet, Banknote } from "lucide-react";

export default function DayEnd() {
  // Use the latest working day from seed data
  const day = "2026-04-19";
  const rows = useMemo(
    () => TRANSACTIONS.filter((t) => t.date.startsWith(day)),
    []
  );

  const sumBy = (type) =>
    rows.filter((r) => r.type === type).reduce((a, r) => a + r.amount, 0);

  const deposits = sumBy("Deposit");
  const withdrawals = sumBy("Withdrawal");
  const repayments = sumBy("Loan Repay");
  const transfers = sumBy("Transfer");
  const systemBalance = deposits + repayments - withdrawals - transfers;

  const [cashCounted, setCashCounted] = useState(systemBalance);
  const [closed, setClosed] = useState(false);
  const variance = Number(cashCounted) - systemBalance;
  const reconciled = variance === 0;

  return (
    <Page
      title="Day-End Closing"
      subtitle={`Reconciliation for ${day} · ${rows.length} transactions`}
      actions={
        <button
          onClick={() => window.print()}
          className="h-10 px-3 rounded-lg bg-white border border-slate-200 text-sm flex items-center gap-2 hover:bg-slate-50"
        >
          <Printer className="h-4 w-4" /> Print Summary
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard icon={Banknote} label="Total Deposits"    value={money(deposits)}    tone="green"  />
        <StatCard icon={Wallet}   label="Total Withdrawals" value={money(withdrawals)} tone="blue"   />
        <StatCard icon={Scale}    label="Loan Repayments"   value={money(repayments)}  tone="violet" />
        <StatCard icon={ClipboardCheck} label="System Net Cash" value={money(systemBalance)} tone="amber" />
      </div>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="font-semibold">Cash Reconciliation</div>
            <div className="text-xs text-slate-500">Compare physical cash counted vs. system-computed balance</div>
          </div>
          {closed ? (
            <Badge tone="green">
              <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Closed
            </Badge>
          ) : (
            <Badge tone="amber">Open</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="System cash balance (auto)">
            <Input value={money(systemBalance)} readOnly />
          </Field>
          <Field label="Physical cash counted (NPR)">
            <Input
              type="number"
              value={cashCounted}
              onChange={(e) => setCashCounted(e.target.value)}
              disabled={closed}
            />
          </Field>
          <Field label="Variance">
            <div
              className={`h-10 px-3 rounded-lg border text-sm flex items-center font-semibold ${
                reconciled
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {reconciled ? "Balanced · NPR 0" : `${variance > 0 ? "+" : ""}${money(variance)}`}
            </div>
          </Field>
        </div>

        {!reconciled && !closed && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-800 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <div>
              <div className="font-medium">Variance detected</div>
              <div className="text-xs">Investigate cash drawer entries and transaction posting before closing the day.</div>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          {!closed ? (
            <button
              onClick={() => setClosed(true)}
              disabled={!reconciled}
              className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Close Day
            </button>
          ) : (
            <button
              onClick={() => setClosed(false)}
              className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
            >
              Reopen
            </button>
          )}
        </div>
      </Card>

      <Table
        columns={[
          { key: "id", label: "Txn ID" },
          { key: "date", label: "Time" },
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
            key: "flagged", label: "Review",
            render: (r) =>
              r.flagged ? <Badge tone="red">Flagged</Badge> : <Badge tone="green">OK</Badge>,
          },
        ]}
        rows={rows}
      />
    </Page>
  );
}
