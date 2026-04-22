import { useState, useMemo } from "react";
import { Page, Table, Badge, Card, Modal, Field, Input, Select, Progress, money } from "../components/ui";
import { MEMBERS, LOANS, PASSBOOKS, DOCUMENTS } from "../data";
import { Plus, Search, Filter, Download, ShieldCheck, FileText, UploadCloud, Eye, UserPlus } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Members() {
  const { user } = useAuth();
  const [list, setList] = useState([...MEMBERS]);
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState(newForm());

  function newForm() {
    return { name: "", email: "", phone: "", kycFile: "", kycType: "Citizenship" };
  }

  const verifyKyc = (m) => {
    setList((ls) => ls.map((x) => (x.id === m.id ? { ...x, kyc: "Verified" } : x)));
  };

  const register = (e) => {
    e.preventDefault();
    const id = `M-${1000 + list.length + 1}`;
    const newMember = {
      id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      joined: new Date().toISOString().slice(0, 10),
      kyc: form.kycFile ? "Pending" : "Pending",
      status: "Active",
      savings: 0,
      loans: 0,
    };
    setList((ls) => [...ls, newMember]);
    setAddOpen(false);
    setForm(newForm());
  };

  const rows = list.filter(
    (m) =>
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.id.toLowerCase().includes(q.toLowerCase()) ||
      m.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Page
      title="Members"
      subtitle={`${list.length} registered members`}
      actions={
        <>
          <button className="h-10 px-3 rounded-lg bg-white border border-slate-200 text-sm flex items-center gap-2 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> New Member
          </button>
        </>
      }
    >
      <Card className="p-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, ID, email…"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-100 text-sm outline-none focus:ring-2 ring-blue-400/40"
          />
        </div>
        <button className="h-10 px-3 rounded-lg border border-slate-200 text-sm flex items-center gap-2 hover:bg-slate-50">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </Card>

      <Table
        columns={[
          { key: "id", label: "ID" },
          {
            key: "name",
            label: "Member",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 grid place-items-center text-white text-xs font-bold">
                  {r.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.email}</div>
                </div>
              </div>
            ),
          },
          { key: "phone", label: "Phone" },
          { key: "joined", label: "Joined" },
          {
            key: "kyc", label: "KYC",
            render: (r) => <Badge tone={r.kyc === "Verified" ? "green" : "amber"}>{r.kyc}</Badge>,
          },
          {
            key: "status", label: "Status",
            render: (r) => <Badge tone={r.status === "Active" ? "green" : "red"}>{r.status}</Badge>,
          },
          { key: "savings", label: "Savings", render: (r) => money(r.savings) },
          { key: "loans", label: "Loan Bal.", render: (r) => (r.loans ? money(r.loans) : "—") },
          {
            key: "actions", label: "Actions",
            render: (r) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetail(r)}
                  className="h-7 px-2 rounded-md border border-slate-200 text-xs flex items-center gap-1 hover:bg-slate-50"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                {user.role === "admin" && r.kyc === "Pending" && (
                  <button
                    onClick={() => verifyKyc(r)}
                    className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Verify KYC
                  </button>
                )}
              </div>
            ),
          },
        ]}
        rows={rows}
      />

      {/* New member modal with KYC upload */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Register New Member"
        subtitle="Collect KYC and onboard the member. Documents are stored in the secure vault."
        footer={
          <>
            <button onClick={() => setAddOpen(false)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={register} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Create Member
            </button>
          </>
        }
      >
        <form onSubmit={register} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Ram Bahadur Thapa" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="ram@scms.coop" />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+977-98…" />
          </Field>
          <Field label="KYC document type">
            <Select value={form.kycType} onChange={(e) => setForm({ ...form, kycType: e.target.value })}>
              <option>Citizenship</option>
              <option>Passport</option>
              <option>Driving License</option>
            </Select>
          </Field>
          <Field label="Upload KYC document" hint="Demo only — file is not transmitted to the server.">
            <input
              type="file"
              onChange={(e) => setForm({ ...form, kycFile: e.target.files?.[0]?.name || "" })}
              className="block w-full text-sm text-slate-600 file:h-10 file:mr-3 file:px-4 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:text-sm file:cursor-pointer"
            />
            {form.kycFile && (
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700">
                <UploadCloud className="h-4 w-4" /> {form.kycFile}
              </div>
            )}
          </Field>
        </form>
      </Modal>

      {/* Member detail drawer: passbook + loan progress + documents */}
      <MemberDetail member={detail} onClose={() => setDetail(null)} />
    </Page>
  );
}

function MemberDetail({ member, onClose }) {
  const passbook = useMemo(() => (member ? PASSBOOKS[member.name] || [] : []), [member]);
  const loans = useMemo(() => (member ? LOANS.filter((l) => l.member === member.name) : []), [member]);
  const docs = useMemo(() => (member ? DOCUMENTS.filter((d) => d.member === member.name) : []), [member]);

  return (
    <Modal
      open={!!member}
      onClose={onClose}
      wide
      title={member?.name}
      subtitle={member ? `${member.id} · ${member.email} · Joined ${member.joined}` : ""}
    >
      {member && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="KYC" value={<Badge tone={member.kyc === "Verified" ? "green" : "amber"}>{member.kyc}</Badge>} />
            <Stat label="Status" value={<Badge tone={member.status === "Active" ? "green" : "red"}>{member.status}</Badge>} />
            <Stat label="Savings" value={money(member.savings)} />
            <Stat label="Outstanding Loans" value={money(member.loans)} />
          </div>

          {loans.length > 0 && (
            <section>
              <div className="font-semibold mb-2 flex items-center gap-2">Loan Progress</div>
              <div className="space-y-3">
                {loans.map((l) => {
                  const paid = l.amount - l.balance;
                  const pct = (paid / l.amount) * 100;
                  return (
                    <Card key={l.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold">{l.id} · {money(l.amount)} @ {l.rate}% for {l.term} mo</div>
                          <div className="text-xs text-slate-500">
                            Paid {money(paid)} of {money(l.amount)} · Remaining {money(l.balance)}
                          </div>
                        </div>
                        <Badge tone={l.status === "Active" ? "green" : l.status === "Pending" ? "amber" : "slate"}>{l.status}</Badge>
                      </div>
                      <Progress value={pct} tone={pct >= 90 ? "green" : pct >= 50 ? "blue" : "violet"} />
                      <div className="text-[11px] text-slate-500 mt-1">{pct.toFixed(1)}% repaid</div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="font-semibold mb-2">Digital Passbook</div>
            {passbook.length === 0 ? (
              <Card className="p-6 text-center text-sm text-slate-500">No passbook entries for this member yet.</Card>
            ) : (
              <Card className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold">Date</th>
                      <th className="text-left px-4 py-2 font-semibold">Description</th>
                      <th className="text-right px-4 py-2 font-semibold">Debit</th>
                      <th className="text-right px-4 py-2 font-semibold">Credit</th>
                      <th className="text-right px-4 py-2 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {passbook.map((p, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2">{p.date}</td>
                        <td className="px-4 py-2">{p.desc}</td>
                        <td className="px-4 py-2 text-right text-red-600">{p.debit ? money(p.debit) : "—"}</td>
                        <td className="px-4 py-2 text-right text-emerald-600">{p.credit ? money(p.credit) : "—"}</td>
                        <td className="px-4 py-2 text-right font-semibold">{money(p.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </section>

          <section>
            <div className="font-semibold mb-2">Documents</div>
            {docs.length === 0 ? (
              <Card className="p-6 text-center text-sm text-slate-500">No documents uploaded.</Card>
            ) : (
              <Card className="divide-y divide-slate-100">
                {docs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 grid place-items-center">
                        <FileText className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{d.name}</div>
                        <div className="text-xs text-slate-500">{d.type} · {d.size} · {d.uploaded}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Secure download started (demo).")}
                      className="h-8 px-2 rounded-md border border-slate-200 hover:bg-slate-50 text-xs flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </div>
                ))}
              </Card>
            )}
          </section>
        </div>
      )}
    </Modal>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="font-semibold mt-0.5 text-sm">{value}</div>
    </div>
  );
}
