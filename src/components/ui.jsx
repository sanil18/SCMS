export function Page({ title, subtitle, actions, children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, trend, tone = "blue" }) {
  const tones = {
    blue: "from-blue-500 to-indigo-500",
    green: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-rose-500",
    violet: "from-violet-500 to-purple-500",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {trend && <div className="text-xs text-emerald-600 mt-1">{trend}</div>}
        </div>
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${tones[tone]} grid place-items-center text-white shadow`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Table({ columns, rows, empty = "No records" }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  {empty}
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={r.id || i} className="hover:bg-slate-50/60">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 whitespace-nowrap">
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export const money = (n) =>
  "NPR " + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
