import { useState } from "react";
import { Page, Card, Badge, Field, Input, Select } from "../components/ui";
import { useAuth } from "../AuthContext";
import { DEFAULT_CONFIG } from "../data";
import { ShieldCheck, Lock, KeyRound, Mail, Bell, Save, Percent, Landmark, AlertTriangle } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [cfg, setCfg] = useState({ ...DEFAULT_CONFIG });
  const [saved, setSaved] = useState(false);

  const update = (k, v) => {
    setSaved(false);
    setCfg((c) => ({ ...c, [k]: v }));
  };

  const save = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Page title="Settings" subtitle="Account, system configuration and security preferences">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center text-white text-lg font-bold">
              {user.avatar}
            </div>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
              <Badge tone="blue">{user.role}</Badge>
            </div>
          </div>
          <div className="mt-5 text-sm space-y-2">
            <Row label="User ID" value={user.id} />
            <Row label="Username" value={user.username} />
            <Row label="Last login" value="Just now · 10.0.0.14" />
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="font-semibold mb-4">Security</div>
          <ul className="space-y-3">
            <SecurityRow icon={ShieldCheck} title="Multi-factor authentication" desc="TOTP authenticator app · enforced at login" status="Enabled" tone="green" />
            <SecurityRow icon={Lock}        title="Password"                   desc="Hashed with bcrypt · rotated 42 days ago"   status="Strong"  tone="green" />
            <SecurityRow icon={KeyRound}    title="Active sessions"            desc="1 active session on this device"             status="Secure"  tone="green" />
            <SecurityRow icon={Mail}        title="Email alerts"               desc="Get notified on logins from new devices"     status="On"      tone="blue" />
            <SecurityRow icon={Bell}        title="Anomaly alerts"             desc="Receive instant notice on flagged transactions" status="On"   tone="blue" />
          </ul>
        </Card>
      </div>

      {/* Admin system configuration */}
      <form onSubmit={save} className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center">
              <Percent className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold">Savings & Loan Products</div>
              <div className="text-xs text-slate-500">Default interest, term and penalty rates applied to new products</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Savings interest rate (% p.a.)">
              <Input type="number" step="0.1" value={cfg.savingsRate} onChange={(e) => update("savingsRate", e.target.value)} />
            </Field>
            <Field label="Base loan rate (% p.a.)">
              <Input type="number" step="0.1" value={cfg.loanRate} onChange={(e) => update("loanRate", e.target.value)} />
            </Field>
            <Field label="Overdue penalty rate (% / month)">
              <Input type="number" step="0.1" value={cfg.penaltyRate} onChange={(e) => update("penaltyRate", e.target.value)} />
            </Field>
            <Field label="Maximum loan term (months)">
              <Input type="number" value={cfg.maxLoanTerm} onChange={(e) => update("maxLoanTerm", e.target.value)} />
            </Field>
            <Field label="Maximum loan amount (NPR)">
              <Input type="number" value={cfg.maxLoanAmount} onChange={(e) => update("maxLoanAmount", e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg bg-red-100 text-red-700 grid place-items-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold">Fraud Detection Thresholds</div>
              <div className="text-xs text-slate-500">Rule-based anomaly detection thresholds applied to every new transaction</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Spike multiplier (× 30-day avg)" hint="Flag if amount exceeds this × member's 30-day average">
              <Input type="number" value={cfg.fraudSpikeMultiplier} onChange={(e) => update("fraudSpikeMultiplier", e.target.value)} />
            </Field>
            <Field label="High-amount threshold (NPR)">
              <Input type="number" value={cfg.fraudHighAmount} onChange={(e) => update("fraudHighAmount", e.target.value)} />
            </Field>
            <Field label="Night hours start (24h)">
              <Input type="number" min="0" max="23" value={cfg.fraudNightHourStart} onChange={(e) => update("fraudNightHourStart", e.target.value)} />
            </Field>
            <Field label="Night hours end (24h)">
              <Input type="number" min="0" max="23" value={cfg.fraudNightHourEnd} onChange={(e) => update("fraudNightHourEnd", e.target.value)} />
            </Field>
            <Field label="Enforce MFA for staff">
              <Select value={cfg.mfaRequired ? "yes" : "no"} onChange={(e) => update("mfaRequired", e.target.value === "yes")}>
                <option value="yes">Required</option>
                <option value="no">Optional</option>
              </Select>
            </Field>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <div className="text-sm text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Configuration saved and audit-logged.
            </div>
          )}
          <button type="submit" className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Configuration
          </button>
        </div>
      </form>

      <Card className="p-5">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <Landmark className="h-4 w-4" /> Compliance
        </div>
        <p className="text-sm text-slate-600">
          SCMS is configured with AES-256 encryption at rest, TLS 1.3 in transit, bcrypt password hashing,
          JWT-authenticated APIs with rate limiting, and immutable audit logging — aligned with local
          financial data protection regulations.
        </p>
      </Card>
    </Page>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SecurityRow({ icon: Icon, title, desc, status, tone }) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
      <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 grid place-items-center text-slate-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <Badge tone={tone}>{status}</Badge>
    </li>
  );
}
