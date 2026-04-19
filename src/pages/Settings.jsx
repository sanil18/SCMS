import { Page, Card, Badge } from "../components/ui";
import { useAuth } from "../AuthContext";
import { ShieldCheck, Lock, KeyRound, Mail, Bell } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  return (
    <Page title="Settings" subtitle="Account, security and notification preferences">
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
            <SecurityRow
              icon={ShieldCheck}
              title="Multi-factor authentication"
              desc="TOTP authenticator app · enforced at login"
              status="Enabled"
              tone="green"
            />
            <SecurityRow
              icon={Lock}
              title="Password"
              desc="Hashed with bcrypt · rotated 42 days ago"
              status="Strong"
              tone="green"
            />
            <SecurityRow
              icon={KeyRound}
              title="Active sessions"
              desc="1 active session on this device"
              status="Secure"
              tone="green"
            />
            <SecurityRow
              icon={Mail}
              title="Email alerts"
              desc="Get notified on logins from new devices"
              status="On"
              tone="blue"
            />
            <SecurityRow
              icon={Bell}
              title="Anomaly alerts"
              desc="Receive instant notice on flagged transactions"
              status="On"
              tone="blue"
            />
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <div className="font-semibold mb-2">Compliance</div>
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
