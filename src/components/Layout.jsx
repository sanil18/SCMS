import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { NAV } from "../data";
import { useState, useEffect, useRef } from "react";
import { NOTIFICATIONS } from "../data";
import {
  LayoutDashboard, Users, PiggyBank, Landmark, ArrowLeftRight,
  AlertTriangle, FileClock, Settings, LogOut, ShieldCheck, Bell, Search,
  FileBarChart2, Mail, MessageSquare, Info, CheckCircle2
} from "lucide-react";

const ICONS = {
  dashboard: LayoutDashboard,
  members: Users,
  savings: PiggyBank,
  loans: Landmark,
  transactions: ArrowLeftRight,
  anomalies: AlertTriangle,
  reports: FileBarChart2,
  audit: FileClock,
  settings: Settings,
};

const LABELS = {
  dashboard: "Dashboard",
  members: "Members",
  savings: "Savings",
  loans: "Loans",
  transactions: "Transactions",
  anomalies: "Anomalies",
  reports: "Reports",
  audit: "Audit Log",
  settings: "Settings",
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV[user.role] || [];
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const doLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const unread = NOTIFICATIONS.filter((n) => n.type === "alert").length;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 flex flex-col">
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold tracking-tight">SCMS</div>
            <div className="text-[11px] text-slate-400">Secure Coop Mgmt</div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {items.map((key) => {
            const Icon = ICONS[key];
            return (
              <NavLink
                key={key}
                to={`/${key}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {LABELS[key]}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center font-bold text-white text-sm">
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-[11px] text-slate-400 capitalize">{user.role}</div>
            </div>
            <button
              onClick={doLogout}
              title="Log out"
              className="p-2 rounded-md hover:bg-white/10 text-slate-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search members, transactions, loans…"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-100 text-sm outline-none focus:ring-2 ring-blue-400/40"
            />
          </div>
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2 rounded-lg hover:bg-slate-100"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] grid place-items-center font-bold">
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Notifications</div>
                    <div className="text-[11px] text-slate-500">{unread} alerts · {NOTIFICATIONS.length} total</div>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">Mark all read</button>
                </div>
                <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                  {NOTIFICATIONS.map((n) => {
                    const Icon =
                      n.type === "alert" ? AlertTriangle :
                      n.type === "success" ? CheckCircle2 : Info;
                    const tone =
                      n.type === "alert" ? "text-red-600 bg-red-50" :
                      n.type === "success" ? "text-emerald-600 bg-emerald-50" :
                      "text-blue-600 bg-blue-50";
                    const ChannelIcon =
                      n.channel === "email" ? Mail :
                      n.channel === "sms" ? MessageSquare : Bell;
                    return (
                      <li key={n.id} className="p-3 hover:bg-slate-50 flex gap-3">
                        <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${tone}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium text-sm truncate">{n.title}</div>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{n.body}</div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 capitalize">
                            <ChannelIcon className="h-3 w-3" /> via {n.channel}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="p-2 border-t border-slate-100 text-center">
                  <button className="text-xs text-blue-600 hover:underline">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-sm">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center font-bold text-white text-xs">
              {user.avatar}
            </div>
            <div className="hidden sm:block">
              <div className="font-medium leading-tight">{user.name}</div>
              <div className="text-[11px] text-slate-500 capitalize">{user.role}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
