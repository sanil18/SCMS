import { useState } from "react";
import { useAuth } from "../AuthContext";
import { ShieldCheck, Lock, User, KeyRound, ArrowRight } from "lucide-react";

export default function Login() {
  const { login, verifyOtp } = useAuth();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitCreds = (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    setTimeout(() => {
      const r = login(username.trim(), password);
      setLoading(false);
      if (!r.ok) return setErr(r.error);
      setPending(r.user);
      setStep(2);
    }, 450);
  };

  const submitOtp = (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    setTimeout(() => {
      const r = verifyOtp(pending, otp.trim());
      setLoading(false);
      if (!r.ok) return setErr(r.error);
    }, 450);
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">
        {/* Brand panel */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight">SCMS</div>
              <div className="text-xs text-slate-400">Secure Cooperative Management System</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Manage members, savings & loans with <span className="text-emerald-400">zero‑trust</span> security.
          </h1>
        </div>

        {/* Form panel */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="md:hidden flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="text-lg font-bold">SCMS</div>
          </div>

          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
              <p className="text-sm text-slate-400 mb-6">Sign in to your cooperative workspace.</p>

              <form onSubmit={submitCreds} className="space-y-4">
                <Field icon={<User className="h-4 w-4" />} label="Email">
                  <input
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                    required
                  />
                </Field>

                <Field icon={<Lock className="h-4 w-4" />} label="Password">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                    required
                  />
                </Field>

                {err && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">{err}</div>}

                <button
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 font-semibold hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? "Verifying…" : (<>Continue <ArrowRight className="h-4 w-4" /></>)}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 select-none">
                  <input type="checkbox" className="accent-emerald-500" defaultChecked />
                  Remember this device for 30 days
                </label>
                <a href="#" className="hover:text-slate-200">Forgot password?</a>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold mb-1">Two-factor verification</h2>
              <p className="text-sm text-slate-400 mb-6">
                Enter the 6-digit code from your authenticator app.
              </p>
              <form onSubmit={submitOtp} className="space-y-4">
                <Field icon={<KeyRound className="h-4 w-4" />} label="One-time code">
                  <input
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="••••••"
                    type="password"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 tracking-[0.5em] text-lg"
                    required
                  />
                </Field>

                {err && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">{err}</div>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(""); setErr(""); }}
                    className="h-11 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    disabled={loading}
                    className="flex-1 h-11 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 font-semibold hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? "Verifying…" : (<>Verify & Sign in <ArrowRight className="h-4 w-4" /></>)}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">{label}</div>
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 h-11 focus-within:border-blue-400/60">
        <span className="text-slate-400">{icon}</span>
        {children}
      </div>
    </label>
  );
}

